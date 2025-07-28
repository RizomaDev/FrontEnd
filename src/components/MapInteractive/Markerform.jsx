import React, { useState } from 'react';
import { useAddBookmarkForm } from '../../hooks/useAddBookmarkForm';
import CategoryIcon from './CategoryIcon';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/mapConstants';
import BookmarkSuccessModal from '../Forms/FormAddBookmark/BookmarkSuccessModal';
import BookmarkErrorModal from '../Forms/FormAddBookmark/BookmarkErrorModal';
import { buildBookmarkPayload } from '../Forms/FormAddBookmark/bookmarkPayloadBuilder';

export default function MarkerForm({ position, onSubmit, onCancel }) {
  const {
    tags,
    categories,
    loadingTags,
    loadingCategories,
    showSuccessModal,
    setShowSuccessModal,
    showErrorModal,
    setShowErrorModal,
    errorMessage,
    handleSubmit: submitBookmark
  } = useAddBookmarkForm(onSubmit);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tagId: '',
    categoryId: '',
    images: [],
    video: '',
    url: '',
    latitude: position ? position[0].toString() : '',
    longitude: position ? position[1].toString() : ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, images: Array.from(e.target.files) }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = await buildBookmarkPayload(formData);
      await submitBookmark(payload, () => {
        setFormData({
          title: '',
          description: '',
          tagId: '',
          categoryId: '',
          images: [],
          video: '',
          url: '',
          latitude: position ? position[0].toString() : '',
          longitude: position ? position[1].toString() : ''
        });
      });
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
      setShowErrorModal(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onCancel();
  };

  if (!position) return null;

  const categoryLower = formData.categoryId ? categories.find(c => c.id === formData.categoryId)?.name.toLowerCase() : '';
  const backgroundColor = CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1003]">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4">Agregar Marcador</h3>
        <p className="text-sm text-gray-600 mb-4">
          Coordenadas: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </p>
        
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Título</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Descripción</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full h-24"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Categoría</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="select select-bordered w-full"
              required
              disabled={loadingCategories}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Etiqueta</span>
            </label>
            <select
              name="tagId"
              value={formData.tagId}
              onChange={handleInputChange}
              className="select select-bordered w-full"
              required
              disabled={loadingTags}
            >
              <option value="">Selecciona una etiqueta</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">URL del Video (opcional)</span>
            </label>
            <input
              type="url"
              name="video"
              value={formData.video}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">URL Adicional (opcional)</span>
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="https://..."
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Imágenes (mínimo 3)</span>
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
              multiple
              accept="image/*"
              required
              min="3"
            />
            {formData.images.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {formData.images.length} {formData.images.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loadingCategories || loadingTags}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>

      <BookmarkSuccessModal
        show={showSuccessModal}
        onClose={handleCloseSuccessModal}
      />
      
      <BookmarkErrorModal
        show={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
    </div>
  );
} 