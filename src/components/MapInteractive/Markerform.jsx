import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useAddBookmarkForm } from '../../hooks/useAddBookmarkForm';
import CategoryIcon from './CategoryIcon';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/mapConstants';
import BookmarkSuccessModal from '../Forms/FormAddBookmark/BookmarkSuccessModal';
import BookmarkErrorModal from '../Forms/FormAddBookmark/BookmarkErrorModal';
import { buildBookmarkPayload } from '../Forms/FormAddBookmark/bookmarkPayloadBuilder';
import { getLocationName } from '../../service/mapService';

export default function MarkerForm({ position, onSubmit, onCancel }) {
  const [locationName, setLocationName] = useState('Cargando ubicación...');
  
  const { 
    register, 
    handleSubmit: formHandleSubmit, 
    formState: { errors }, 
    reset,
    getValues 
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      tagId: '',
      categoryId: '',
      images: [],
      video: '',
      url: '',
      latitude: position ? position[0].toString() : '',
      longitude: position ? position[1].toString() : ''
    }
  });

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

  useEffect(() => {
    const fetchLocationName = async () => {
      if (position) {
        const name = await getLocationName(position[0], position[1]);
        setLocationName(name);
      }
    };
    fetchLocationName();
  }, [position]);

  const handleFormSubmit = async (data) => {
    try {
      const payload = await buildBookmarkPayload({
        ...data,
        latitude: position[0].toString(),
        longitude: position[1].toString()
      });
      await submitBookmark(payload, reset);
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

  const categoryLower = categories.find(c => c.id === getValues()?.categoryId)?.name.toLowerCase() || '';
  const backgroundColor = CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 z-[9999]">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      <div className="bg-base-100 rounded-lg shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
        <h3 className="text-2xl font-bold mb-4 text-primary">Agregar Marcador</h3>
        <p className="text-sm text-base-content/70 mb-4">
          {locationName}
        </p>
        
        <form onSubmit={formHandleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Título <span className="text-error">*</span></span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("title", { 
                required: "El título es requerido",
                minLength: { value: 3, message: "El título debe tener al menos 3 caracteres" }
              })}
            />
            {errors.title && (
              <span className="text-error text-sm mt-1">{errors.title.message}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Descripción <span className="text-error">*</span></span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24"
              {...register("description", { 
                required: "La descripción es requerida",
                minLength: { value: 100, message: "La descripción debe tener al menos 100 caracteres" }
              })}
            />
            {errors.description && (
              <span className="text-error text-sm mt-1">{errors.description.message}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Categoría <span className="text-error">*</span></span>
            </label>
            <select
              className="select select-bordered w-full"
              {...register("categoryId", { required: "Debes seleccionar una categoría" })}
              disabled={loadingCategories}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <span className="text-error text-sm mt-1">{errors.categoryId.message}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Etiqueta <span className="text-error">*</span></span>
            </label>
            <select
              className="select select-bordered w-full"
              {...register("tagId", { required: "Debes seleccionar una etiqueta" })}
              disabled={loadingTags}
            >
              <option value="">Selecciona una etiqueta</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
            {errors.tagId && (
              <span className="text-error text-sm mt-1">{errors.tagId.message}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">URL del Video (opcional)</span>
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="https://www.youtube.com/watch?v=..."
              {...register("video", {
                pattern: {
                  value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                  message: "Debe ser una URL válida de YouTube"
                }
              })}
            />
            {errors.video && (
              <span className="text-error text-sm mt-1">{errors.video.message}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">URL Adicional (opcional)</span>
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="https://..."
              {...register("url", {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Debe ser una URL válida"
                }
              })}
            />
            {errors.url && (
              <span className="text-error text-sm mt-1">{errors.url.message}</span>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Imágenes <span className="text-error">*</span></span>
              <span className="label-text-alt">(mínimo 3)</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              multiple
              accept="image/*"
              {...register("images", {
                required: "Debes subir al menos 3 imágenes",
                validate: {
                  minFiles: files => !files || files.length >= 3 || "Debes subir al menos 3 imágenes",
                  fileType: files => {
                    if (!files) return true;
                    return Array.from(files).every(file => 
                      file.type === "image/jpeg" || file.type === "image/png"
                    ) || "Solo se permiten archivos JPG y PNG";
                  }
                }
              })}
            />
            {errors.images && (
              <span className="text-error text-sm mt-1">{errors.images.message}</span>
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