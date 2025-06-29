import { useState, useEffect } from "react";
import { getCategories, getTags, createBookmark } from "../service/apiService";

export function useAddBookmarkForm(onSuccess) {
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [tagsError, setTagsError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoadingTags(true);
    getTags()
      .then(setTags)
      .catch((err) => setTagsError(err.message))
      .finally(() => setLoadingTags(false));
    setLoadingCategories(true);
    getCategories()
      .then(setCategories)
      .catch((err) => setCategoriesError(err.message))
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleSubmit = async (data, reset) => {
    try {
      const payload = {
        ...data,
        images: Array.isArray(data.images) ? data.images : []
      };
      await createBookmark (payload);
      setShowSuccessModal(true);
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      setErrorMessage(error.message || "Error adding bookmark");
      setShowErrorModal(true);
    }
  };

  return {
    tags, categories,
    loadingTags, loadingCategories,
    tagsError, categoriesError,
    showSuccessModal, setShowSuccessModal,
    showErrorModal, setShowErrorModal,
    errorMessage, setErrorMessage,
    handleSubmit
  };
}
