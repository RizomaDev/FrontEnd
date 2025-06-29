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
}) {
  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>

       <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">
            Título del marcador <span className="text-error">*</span>
          </span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("title", { required: "El título del marcador es requerido." })}
        />
        {errors.title && (
          <span className="text-error text-sm mt-1"> 
            {errors.title.message}
          </span>
        )}
      </div>

      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">
            Tag <span className="text-error">*</span>
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
            <option>Loading tags...</option>
          ) : tagsError ? (
            <option className="text-error">{tagsError}</option>
          ) : (
            sortedTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
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
            Category <span className="text-error">*</span>
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