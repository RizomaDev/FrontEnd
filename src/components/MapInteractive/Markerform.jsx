import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useAddBookmarkForm } from '../../hooks/useAddBookmarkForm';
import CategoryIcon from './CategoryIcon';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/mapConstants';
import BookmarkErrorModal from '../Forms/FormAddBookmark/BookmarkErrorModal';
import { buildBookmarkPayloadSimple } from '../../utils/bookmarkPayloadBuilder';
import { getLocationName } from '../../service/mapService';
import VideoUpload from '../VideoUpload/VideoUpload';
import ImageUpload from '../ImageUpload/ImageUpload';

export default function MarkerForm({ position, onSubmit, onCancel }) {
  const [locationName, setLocationName] = useState('Cargando ubicación...');
  const [imageUrls, setImageUrls] = useState([]);

  const { 
    register, 
    handleSubmit: formHandleSubmit, 
    formState: { errors }, 
    reset,
    getValues,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      tagId: '',
      categoryId: '',
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
      const payload = buildBookmarkPayloadSimple({
        ...data,
        imageUrls: imageUrls,
        latitude: position[0].toString(),
        longitude: position[1].toString()
      });
      await submitBookmark(payload, reset);
      setImageUrls([]);
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      setShowErrorModal(true);
    }
  };

  const handleVideoUrlReceived = (url) => {
    setValue("video", url);
  };

  const handleImagesReceived = (urls) => {
    setImageUrls(urls);
  };

  const titleValue = watch("title") || "";
  const descriptionValue = watch("description") || "";
  const titleCharacterCount = titleValue.length;
  const descriptionCharacterCount = descriptionValue.length;
  const titleMaxCharacters = 100;
  const descriptionMaxCharacters = 250;
  const titleIsNearLimit = titleCharacterCount > titleMaxCharacters * 0.8;
  const titleIsOverLimit = titleCharacterCount > titleMaxCharacters;
  const descriptionIsNearLimit = descriptionCharacterCount > descriptionMaxCharacters * 0.8;
  const descriptionIsOverLimit = descriptionCharacterCount > descriptionMaxCharacters;

  if (!position) return null;

  const categoryId = getValues()?.categoryId ? parseInt(getValues().categoryId, 10) : null;
  const tagId = getValues()?.tagId ? parseInt(getValues().tagId, 10) : null;

  const category = categories.find(c => c.id === categoryId);
  const tag = tags.find(t => t.id === tagId);

  const categoryLower = category?.name.toLowerCase() || '';
  const backgroundColor = CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 z-[9999]">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      <div className="bg-base-100 rounded-lg shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
        <h3 className="text-2xl font-bold text-primary mb-6">Agregar Marcador</h3>
        <p className="text-sm text-base-content/70 mb-4">
          {locationName}
        </p>
        
        <form onSubmit={formHandleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Título (máx. 100 caracteres) <span className="text-error">*</span></span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("title", { 
                required: "El título es requerido",
                minLength: { value: 3, message: "El título debe tener al menos 3 caracteres" },
                maxLength: { value: 100, message: "El título no puede tener más de 100 caracteres" }
              })}
            />
            <div className={`flex justify-between items-center ${errors.title ? 'mt-2' : 'mt-1'}`}>
              <div className="text-sm">
                {errors.title && (
                  <span className="text-error">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <div className={`text-sm font-medium ${
                titleIsOverLimit ? 'text-error' : 
                titleIsNearLimit ? 'text-warning' : 
                'text-base-content/60'
              }`}>
                {titleCharacterCount}/{titleMaxCharacters}
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Descripción (min. 100, máx. 250 caracteres) <span className="text-error">*</span></span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24"
              {...register("description", { 
                required: "La descripción es requerida",
                minLength: { value: 100, message: "La descripción debe tener al menos 100 caracteres" },
                maxLength: { value: 250, message: "La descripción no puede tener más de 250 caracteres" }
              })}
            />
            <div className={`flex justify-between items-center ${errors.description ? 'mt-2' : 'mt-1'}`}>
              <div className="text-sm">
                {errors.description && (
                  <span className="text-error">
                    {errors.description.message}
                  </span>
                )}
              </div>
              <div className={`text-sm font-medium ${
                descriptionIsOverLimit ? 'text-error' : 
                descriptionIsNearLimit ? 'text-warning' : 
                'text-base-content/60'
              }`}>
                {descriptionCharacterCount}/{descriptionMaxCharacters}
              </div>
            </div>
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
              <span className="label-text font-semibold">Contenido multimedia</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Video (opcional)</span>
                </label>
                <VideoUpload onVideoUrlReceived={handleVideoUrlReceived} />
                <input
                  type="hidden"
                  {...register("video")}
                />
                {errors.video && (
                  <span className="text-error text-sm mt-1">{errors.video.message}</span>
                )}
              </div>
              
              <div>
                <ImageUpload 
                  onImagesReceived={handleImagesReceived}
                  maxImages={3}
                />
                {imageUrls.length < 1 && (
                  <span className="text-error text-sm mt-1">
                    Se requiere mínimo 1 imagen (máximo 3)
                  </span>
                )}
              </div>
            </div>
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
              disabled={loadingCategories || loadingTags || imageUrls.length < 1}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>

      <BookmarkErrorModal
        show={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
    </div>
  );
} 