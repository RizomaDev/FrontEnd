import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { getCategories, getTags } from '../service/apiService';

const MapFilters = ({
  categories,
  tags,
  selectedCategories = [],
  selectedTags = [],
  onCategoryChange,
  onTagChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState({ categories: false, tags: false });
  const [error, setError] = useState({ categories: null, tags: null });
  const [localCategories, setLocalCategories] = useState([]);
  const [localTags, setLocalTags] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(prev => ({ ...prev, categories: true }));
      try {
        const data = await getCategories();
        setLocalCategories(data);
      } catch (err) {
        setError(prev => ({ ...prev, categories: 'Error al cargar categorías' }));
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };

    const fetchTags = async () => {
      setLoading(prev => ({ ...prev, tags: true }));
      try {
        const data = await getTags();
        setLocalTags(data);
      } catch (err) {
        setError(prev => ({ ...prev, tags: 'Error al cargar etiquetas' }));
      } finally {
        setLoading(prev => ({ ...prev, tags: false }));
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const clearCategories = () => {
    onCategoryChange({ target: { value: "" } });
  };

  const clearTags = () => {
    onTagChange({ target: { value: [] } });
  };

  // Use localCategories and localTags if available, otherwise fall back to props
  const displayCategories = localCategories.length > 0 ? localCategories : categories;
  const displayTags = localTags.length > 0 ? localTags : tags;

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
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-700 font-medium">Categorías</h3>
              {selectedCategories.length > 0 && (
                <button 
                  onClick={clearCategories}
                  className="btn btn-ghost btn-xs text-gray-500 hover:text-primary"
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="filter flex flex-wrap gap-2">
              {loading.categories ? (
                <span className="text-gray-500">Cargando...</span>
              ) : error.categories ? (
                <span className="text-error">{error.categories}</span>
              ) : (
                displayCategories?.map((category) => (
                  <label 
                    key={category.id} 
                    className={`
                      btn cursor-pointer
                      ${selectedCategories.includes(category.name) ? 'border-2 border-primary/50' : ''}
                    `}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedCategories.includes(category.name)}
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
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-700 font-medium">Etiquetas</h3>
              {selectedTags.length > 0 && (
                <button 
                  onClick={clearTags}
                  className="btn btn-ghost btn-xs text-gray-500 hover:text-primary"
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="filter flex flex-wrap gap-2">
              {loading.tags ? (
                <span className="text-gray-500">Cargando...</span>
              ) : error.tags ? (
                <span className="text-error">{error.tags}</span>
              ) : (
                displayTags?.map((tag) => (
                  <label 
                    key={tag.id} 
                    className={`
                      btn cursor-pointer
                      ${selectedTags.includes(tag.name) ? 'border-2 border-primary/50' : ''}
                    `}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedTags.includes(tag.name)}
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