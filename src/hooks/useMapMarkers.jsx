import { useState, useEffect } from 'react';
import { getAllBookmarks } from '../service/apiService';
import { DEFAULT_TAG } from '../constants/mapConstants';

export const useMapMarkers = () => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const bookmarksData = await getAllBookmarks();
        const validBookmarks = bookmarksData.filter(bookmark => 
          bookmark.location && 
          bookmark.location.latitude && 
          bookmark.location.longitude
        );
        
        const normalizedBookmarks = validBookmarks.map(bookmark => ({
          ...bookmark,
          tag: bookmark.tag || bookmark.category || DEFAULT_TAG
        }));
        
        setMarkers(normalizedBookmarks);

        const uniqueCategories = Array.from(new Set(normalizedBookmarks.map(bookmark => bookmark.category)))
          .filter(category => category)
          .map(category => ({ id: category, name: category }));
        
        const uniqueTags = Array.from(new Set(normalizedBookmarks.map(bookmark => bookmark.tag)))
          .filter(tag => tag)
          .map(tag => ({ id: tag, name: tag }));

        setCategories(uniqueCategories);
        setTags(uniqueTags);
      } catch (err) {
        setError('Error al cargar los marcadores');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const addMarker = (formPosition, data) => {
    const newMarker = { 
      position: formPosition,
      title: data.title,
      description: data.description,
      tag: data.tag,
      category: data.category,
      imageFile: data.imageFile
    };
    setMarkers([...markers, newMarker]);

    if (data.category && !categories.find(c => c.name === data.category)) {
      setCategories([...categories, { id: data.category, name: data.category }]);
    }
    if (data.tag && !tags.find(t => t.name === data.tag)) {
      setTags([...tags, { id: data.tag, name: data.tag }]);
    }
  };

  return {
    markers,
    loading,
    error,
    categories,
    tags,
    addMarker
  };
}; 