import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { getCategories, getTags } from '../service/apiService';

const MapFilters = ({
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState({ categories: false, tags: false });
  const [error, setError] = useState({ categories: null, tags: null });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      setLoading(prev => ({ ...prev, categories: true }));
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        setError(prev => ({ ...prev, categories: null }));
      } catch (err) {
        setError(prev => ({ ...prev, categories: 'Error al cargar categorías' }));
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }

      // Fetch tags
      setLoading(prev => ({ ...prev, tags: true }));
      try {
        const tagsData = await getTags();
        setTags(tagsData);
        setError(prev => ({ ...prev, tags: null }));
      } catch (err) {
        setError(prev => ({ ...prev, tags: 'Error al cargar etiquetas' }));
        console.error('Error fetching tags:', err);
      } finally {
        setLoading(prev => ({ ...prev, tags: false }));
      }
    };

    fetchData();
  }, []);

  return (
    <div className="absolute top-[88px] left-4 z-[1001]">
      <div className="relative">
        {/* Floating Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            bg-secondary rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300
            flex items-center justify-center w-12 h-12
            ${isExpanded ? 'rotate-180' : ''}
          `}
        >
          <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
        </button>

        {/* Filters Panel */}
        <div className={`
          absolute top-16 left-0
          bg-secondary rounded-lg shadow-lg p-4 space-y-4
          transition-all duration-300 origin-top-left
          min-w-[250px]
          ${isExpanded 
            ? 'opacity-100 transform scale-100 translate-y-0' 
            : 'opacity-0 transform scale-95 -translate-y-4 pointer-events-none'}
        `}>
          {/* Categories Filter */}
          <div>
            <h3 className="text-gray-700 font-medium mb-2">Categorías</h3>
            <div className="filter flex flex-wrap gap-2">
              <label className="btn cursor-pointer">
                <input
                  type="radio"
                  className="hidden"
                  name="categories"
                  checked={selectedCategory === ""}
                  onChange={(e) => onCategoryChange({ target: { value: "" } })}
                />
                Todas
              </label>
              
              {loading.categories ? (
                <span className="text-gray-500">Cargando...</span>
              ) : error.categories ? (
                <span className="text-error">{error.categories}</span>
              ) : (
                categories?.map((category) => (
                  <label key={category.id} className="btn cursor-pointer">
                    <input
                      type="radio"
                      className="hidden"
                      name="categories"
                      checked={selectedCategory === category.name}
                      onChange={(e) => onCategoryChange({ target: { value: category.name } })}
                    />
                    {category.name}
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <h3 className="text-gray-700 font-medium mb-2">Etiquetas</h3>
            <div className="filter flex flex-wrap gap-2">
              <label className="btn cursor-pointer">
                <input
                  type="radio"
                  className="hidden"
                  name="tags"
                  checked={selectedTag === ""}
                  onChange={(e) => onTagChange({ target: { value: "" } })}
                />
                Todas
              </label>

              {loading.tags ? (
                <span className="text-gray-500">Cargando...</span>
              ) : error.tags ? (
                <span className="text-error">{error.tags}</span>
              ) : (
                tags?.map((tag) => (
                  <label key={tag.id} className="btn cursor-pointer">
                    <input
                      type="radio"
                      className="hidden"
                      name="tags"
                      checked={selectedTag === tag.name}
                      onChange={(e) => onTagChange({ target: { value: tag.name } })}
                    />
                    {tag.name}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapFilters; 