import { useState } from 'react';

export const useMapFilters = () => {
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedTags, setSelectedTags] = useState(new Set());

  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    const newSelectedCategories = new Set(selectedCategories);
    
    if (categoryName === "") {
      newSelectedCategories.clear();
    } else if (newSelectedCategories.has(categoryName)) {
      newSelectedCategories.delete(categoryName);
    } else {
      newSelectedCategories.add(categoryName);
    }
    
    setSelectedCategories(newSelectedCategories);
  };

  const handleTagChange = (e) => {
    const newSelectedTags = new Set(Array.isArray(e.target.value) ? e.target.value : [e.target.value]);
    setSelectedTags(newSelectedTags);
  };

  const filterMarkers = (markers) => {
    return markers.filter(marker => {
      const matchCategory = selectedCategories.size === 0 || selectedCategories.has(marker.category);
      const matchTag = selectedTags.size === 0 || selectedTags.has(marker.tag);
      return matchCategory && matchTag;
    });
  };

  return {
    selectedCategories: Array.from(selectedCategories),
    selectedTags: Array.from(selectedTags),
    handleCategoryChange,
    handleTagChange,
    filterMarkers
  };
}; 