import React from "react";

export default function FilterCategoryTag({
  categories = [],
  tags = [],
  selectedCategory = "",
  selectedTag = "",
  onCategoryChange,
  onTagChange,
  loadingCategories = false,
  loadingTags = false,
  categoriesError = null,
  tagsError = null,
  categoryLabel = "Filtrar por categoría",
  tagLabel = "Filtrar por etiqueta"
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
      <div className="form-control w-full md:w-auto">
        <label htmlFor="categoryFilter" className="label sr-only">
          <span className="label-text">{categoryLabel}</span>
        </label>
        <select
          id="categoryFilter"
          className="select select-bordered w-full max-w-xs dropdown"
          value={selectedCategory}
          onChange={onCategoryChange}
        >
          <option value="">Todas las categorías</option>
          {loadingCategories ? (
            <option>Cargando categorías...</option>
          ) : categoriesError ? (
            <option className="text-error">{categoriesError}</option>
          ) : (
            categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))
          )}
        </select>
      </div>
      <div className="form-control w-full md:w-auto">
        <label htmlFor="tagFilter" className="label sr-only">
          <span className="label-text">{tagLabel}</span>
        </label>
        <select
          id="tagFilter"
          className="select select-bordered w-full max-w-xs dropdown"
          value={selectedTag}
          onChange={onTagChange}
        >
          <option value="">Todas las etiquetas</option>
          {loadingTags ? (
            <option>Cargando etiquetas...</option>
          ) : tagsError ? (
            <option className="text-error">{tagsError}</option>
          ) : (
            tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
}