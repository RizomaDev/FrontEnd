import React from "react";

export default function BookmarkBasicInfo({
  register,
  errors,
  tags,
  categories,
  loadingTags,
  tagsError,
  loadingCategories,
  categoriesError,
  watch,
}) {
  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));
  
  const titleValue = watch("title") || "";
  const characterCount = titleValue.length;
  const maxCharacters = 100; // Límite razonable para títulos
  const isNearLimit = characterCount > maxCharacters * 0.8; // 80% del límite
  const isOverLimit = characterCount > maxCharacters;

  return (
    <>
      <div className="form-control w-full max-w-md mb-2 text-left">
        <label className="label">
          <span className="label-text font-semibold">
            Título del marcador (máx. 100 caracteres) <span className="text-error">*</span>
          </span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("title", { 
            required: "El título del marcador es requerido.",
            maxLength: { value: 100, message: "El título no puede tener más de 100 caracteres." }
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
            isOverLimit ? 'text-error' : 
            isNearLimit ? 'text-warning' : 
            'text-base-content/60'
          }`}>
            {characterCount}/{maxCharacters}
          </div>
        </div>
      </div>

      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">
          Etiqueta <span className="text-error">*</span>
          </span>
        </label>
        <select
          className="select select-bordered w-full"
          {...register("tagId", { required: "La etiqueta es requerida." })}
        >
          <option value="" disabled>
            Selecciona una etiqueta
          </option>
          {loadingTags ? (
            <option>Cargando etiquetas...</option>
          ) : tagsError ? (
            <option className="text-error">{tagsError}</option>
          ) : (
            sortedTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.emoji} {tag.name}
              </option>
            ))
          )}
        </select>
        {errors.tag && (
          <span className="text-error text-sm mt-1">
            {errors.tag.message}
          </span>
        )}
      </div>

      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">
            Categoría <span className="text-error">*</span>
          </span>
        </label>
        <select
          className="select select-bordered w-full"
          {...register("categoryId", { required: "La categoría es requerida." })}
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          {loadingCategories ? (
            <option>Cargando categorías...</option>
          ) : categoriesError ? (
            <option className="text-error">{categoriesError}</option>
          ) : (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          )}
        </select>
        {errors.category && (
          <span className="text-error text-sm mt-1">
            {errors.category.message}
          </span>
        )}
      </div>

     
    </>
  );
} 