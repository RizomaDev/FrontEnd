import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { getCategories, getTags } from '../service/apiService';
import CategoryIcon from './MapInteractive/CategoryIcon';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../constants/mapConstants';

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
    onCategoryChange({ target: { value: [] } });
  };

  const clearTags = () => {
    onTagChange({ target: { value: [] } });
  };

  const handleCategoryChange = (categoryName) => {
    const newCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(cat => cat !== categoryName)
      : [...selectedCategories, categoryName];
    onCategoryChange({ target: { value: newCategories } });
  };

  const handleTagChange = (tagName) => {
    const newTags = selectedTags.includes(tagName)
      ? selectedTags.filter(tag => tag !== tagName)
      : [...selectedTags, tagName];
    onTagChange({ target: { value: newTags } });
  };

  // Use localCategories and localTags if available, otherwise fall back to props
  const displayCategories = localCategories.length > 0 ? localCategories : categories;
  const displayTags = localTags.length > 0 ? localTags : tags;

  const getCategoryColor = (category) => {
    const categoryLower = category.toLowerCase();
    return CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;
  };

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
          <FontAwesomeIcon icon={faFilter} className="text-white" />
        </button>

        {/* Filters Panel */}
        <div className={`
          absolute top-16 left-0
          bg-white rounded-lg shadow-lg p-6
          transition-all duration-300 origin-top-left
          min-w-[280px]
          ${isExpanded 
            ? 'opacity-100 transform scale-100 translate-y-0' 
            : 'opacity-0 transform scale-95 -translate-y-4 pointer-events-none'}
        `}>
          {/* Categories Filter */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-gray-800 font-semibold">Categorías</h3>
              {selectedCategories.length > 0 && (
                <button 
                  onClick={clearCategories}
                  className="text-xs text-secondary hover:text-secondary/80 font-medium transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
            <div className="filter flex flex-wrap gap-2">
              {loading.categories ? (
                <span className="text-gray-500">Cargando...</span>
              ) : error.categories ? (
                <span className="text-error">{error.categories}</span>
              ) : (
                displayCategories?.map((category) => {
                  const backgroundColor = getCategoryColor(category.name);
                  return (
                    <label 
                      key={category.id} 
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer
                        transition-all duration-200
                        ${selectedCategories.includes(category.name) 
                          ? 'ring-2 ring-white ring-offset-2' 
                          : 'hover:brightness-110'}
                      `}
                      style={{
                        backgroundColor,
                        color: 'white',
                      }}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => handleCategoryChange(category.name)}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-gray-800 font-semibold">Etiquetas</h3>
              {selectedTags.length > 0 && (
                <button 
                  onClick={clearTags}
                  className="text-xs text-secondary hover:text-secondary/80 font-medium transition-colors"
                >
                  Limpiar filtros
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
                      flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer
                      transition-all duration-200 hover:bg-gray-50
                      ${selectedTags.includes(tag.name) 
                        ? 'bg-secondary/5 border-2 border-secondary/30' 
                        : 'bg-gray-50/50 border border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedTags.includes(tag.name)}
                      onChange={() => handleTagChange(tag.name)}
                    />
                    <CategoryIcon 
                      tag={tag.name}
                      size="sm"
                    />
                    <span className="text-sm text-gray-700 font-medium">{tag.name}</span>
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