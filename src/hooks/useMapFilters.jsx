import { useState } from 'react';

export const useMapFilters = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (Array.isArray(value)) {
      setSelectedCategories(value);
    } else if (value === "") {
      setSelectedCategories([]);
    } else {
      const newSelectedCategories = selectedCategories.includes(value)
        ? selectedCategories.filter(cat => cat !== value)
        : [...selectedCategories, value];
      setSelectedCategories(newSelectedCategories);
    }
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    if (Array.isArray(value)) {
      setSelectedTags(value);
    } else if (value === "") {
      setSelectedTags([]);
    } else {
      const newSelectedTags = selectedTags.includes(value)
        ? selectedTags.filter(tag => tag !== value)
        : [...selectedTags, value];
      setSelectedTags(newSelectedTags);
    }
  };

  const filterMarkers = (markers) => {
    return markers.filter(marker => {
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(marker.category);
      const matchTag = selectedTags.length === 0 || selectedTags.includes(marker.tag);
      return matchCategory && matchTag;
    });
  };

  return {
    selectedCategories,
    selectedTags,
    handleCategoryChange,
    handleTagChange,
    filterMarkers
  };
}; 