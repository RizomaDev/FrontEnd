import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { getBookmarkById, getCategories, getTags, updateBookmark } from "../../../service/apiService";

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export default function FormEditBookmark() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [tagsError, setTagsError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      tag: "",
      category: "",
      video: "",
      url: "",
      location_latitude: "",
      location_longitude: "",
      publicationDate: "",
      images: [],
    },
  });

  useEffect(() => {
    const fetchBookmarkAndAuxData = async () => {
      const user = getCurrentUser();
      if (!user) {
        navigate("/login");
        return;
      }
      try {
        const bookmarkData = await getBookmarkById(id);
        if (!bookmarkData.userId || !user.id || bookmarkData.userId !== user.id) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }
        setValue("title", bookmarkData.title || "");
        setValue("description", bookmarkData.description || "");
        setValue("tag", bookmarkData.tag || "");
        setValue("category", bookmarkData.category || "");
        setValue("video", bookmarkData.video || "");
        setValue("url", bookmarkData.url || "");
        setValue("location_latitude", bookmarkData.location?.latitude || "");
        setValue("location_longitude", bookmarkData.location?.longitude || "");
        setValue("publicationDate", bookmarkData.publicationDate ? new Date(bookmarkData.publicationDate).toISOString().slice(0, 16) : "");
        setLoadingCategories(true);
        setCategoriesError(null);
        try {
          const fetchedCategories = await getCategories();
          setCategories(fetchedCategories);
        } catch (error) {
          setCategoriesError("Failed to load categories. Please try again.");
        } finally {
          setLoadingCategories(false);
        }
        setLoadingTags(true);
        setTagsError(null);
        try {
          const fetchedTags = await getTags();
          const sortedTags = [...fetchedTags].sort((a, b) => a.name.localeCompare(b.name));
          setTags(sortedTags);
        } catch (error) {
          setTagsError("Failed to load tags. Please try again.");
        } finally {
          setLoadingTags(false);
        }
      } catch (err) {
        setLoading(false);
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            setUnauthorized(true);
          } else if (err.response.data && err.response.data.message) {
            setErrorMessage(err.response.data.message);
          } else {
            setErrorMessage("Failed to load bookmark details. Please try again.");
          }
        } else {
          setErrorMessage("Network error or server unreachable. Please check your connection.");
        }
        setShowErrorModal(true);
      } finally {
        if (loading) setLoading(false);
      }
    };
    fetchBookmarkAndAuxData();
  }, [id, navigate, setValue, loading]);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (formData) => {
    try {
      if (!formData.title || !formData.description || !formData.tag || !formData.category) {
        setErrorMessage("Please fill in all required fields correctly.");
        setShowErrorModal(true);
        return;
      }
      if (formData.description.length < 10) {
        setErrorMessage("Description must be at least 10 characters long.");
        setShowErrorModal(true);
        return;
      }
      const tagObj = tags.find(t => t.name === formData.tag);
      const categoryObj = categories.find(c => c.name === formData.category);
      const payload = {
        title: formData.title,
        description: formData.description,
        tagId: tagObj ? tagObj.id : null,
        categoryId: categoryObj ? categoryObj.id : null,
        video: formData.video,
        url: formData.url,
        location: {
          latitude: formData.location_latitude ? parseFloat(formData.location_latitude) : null,
          longitude: formData.location_longitude ? parseFloat(formData.location_longitude) : null,
        },
        publicationDate: formData.publicationDate ? new Date(formData.publicationDate).toISOString() : null,
        images: [],
      };
      if (formData.images && formData.images.length > 0) {
        payload.images = await Promise.all(
          Array.from(formData.images).map(async (file) => ({
            base64: await convertFileToBase64(file),
            name: file.name,
            type: file.type,
            size: file.size,
          }))
        );
      }
      await updateBookmark(id, payload);
      setShowSuccessModal(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage("Error: " + error.response.data.message);
      } else {
        setErrorMessage("Failed to update bookmark. Please try again.");
      }
      setShowErrorModal(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/HomePage");
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-4 text-primary text-lg">Loading bookmark data...</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-error shadow-lg max-w-md">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>No tienes permisos para editar este marcador.</span>
          </div>
          <button className="btn btn-sm btn-error" onClick={() => navigate('/HomePage')}>Ir a la página de inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 [filter:sepia(20%)]"
      style={{
        backgroundImage:
          "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
      }}
    >
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl p-8 rounded-lg">
        <div className="card-body items-center text-center p-0">
          <h2 className="card-title text-4xl font-bold text-primary mb-8">
            Editar marcador
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="form-control w-full mb-4 text-left">
              <label className="label">
                <span className="label-text font-semibold">
                  Title <span className="text-error">*</span>
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
            <div className="form-control w-full mb-4 text-left">
              <label className="label">
                <span className="label-text font-semibold">
                  Descripción <span className="text-error">*</span>
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                {...register("description", { required: "La descripción es requerida." })}
              ></textarea>
              {errors.description && (
                <span className="text-error text-sm mt-1">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className="form-control w-full mb-4 text-left">
              <label className="label">
                <span className="label-text font-semibold">
                  Tag <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register("tag", { required: "La etiqueta es requerida." })}
              >
                <option value="" disabled>
                  Selecciona una etiqueta
                </option>
                {loadingTags ? (
                  <option>Loading tags...</option>
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
              {errors.tag && (
                <span className="text-error text-sm mt-1">
                  {errors.tag.message}
                </span>
              )}
            </div>
            <div className="form-control w-full mb-4 text-left">
              <label className="label">
                <span className="label-text font-semibold">
                  Category <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register("category", { required: "La categoría es requerida." })}
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
                    <option key={category.id} value={category.name}>
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
            <div className="form-control w-full mb-4 text-left">
              <label className="label">
                <span className="label-text font-semibold">Video URL</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...register("video")}
              />
            </div>
            <div className="form-control w-full mb-4 text-left">
              <label className="label">
                <span className="label-text font-semibold">Additional Info URL</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...register("url")}
              />
            </div>
            <div className="form-control w-full mb-4 text-left">
              <label className="label">
                <span className="label-text font-semibold">Ubicación (Latitud)</span>
              </label>
              <input
                type="number"
                step="any"
                className="input input-bordered w-full"
                {...register("location_latitude")}
              />
            </div>
            <div className="form-control w-full mb-4 text-left">
              <label className="label">
                <span className="label-text font-semibold">Ubicación (Longitud)</span>
              </label>
              <input
                type="number"
                step="any"
                className="input input-bordered w-full"
                {...register("location_longitude")}
              />
            </div>
            <div className="form-control w-full mb-4 text-left">
              <label className="label">
                <span className="label-text font-semibold">Fecha de publicación</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                {...register("publicationDate")}
              />
            </div>
            <div className="form-control w-full mb-4 text-left">
              <label className="label">
                <span className="label-text font-semibold">Imágenes</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="file-input file-input-bordered w-full"
                {...register("images")}
              />
            </div>
            <div className="flex justify-center w-full mt-6 mx-auto">
              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                Actualizar marcador
              </button>
            </div>
          </form>
        </div>
      </div>
      <dialog id="success_modal" className={`modal ${showSuccessModal ? 'modal-open' : ''}`}>
        <div className="modal-box bg-warning text-black text-center p-8 rounded-lg shadow-lg">
          <h3 className="font-bold text-2xl">Marcador actualizado correctamente!</h3>
          <p className="py-4 text-lg">Tu marcador ha sido actualizado correctamente.</p>
          <div className="modal-action">
            <button
              className="btn btn-success text-white px-6 py-2 rounded-lg"
              onClick={handleCloseSuccessModal}
            >
              Ir a la página de inicio
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="error_modal" className={`modal ${showErrorModal ? 'modal-open' : ''}`}>
        <div className="modal-box bg-error text-white text-center p-8 rounded-lg shadow-lg">
          <h3 className="font-bold text-2xl">Error!</h3>
          <p className="py-4 text-lg">{errorMessage}</p>
          <div className="modal-action">
            <button
              className="btn btn-neutral text-white px-6 py-2 rounded-lg"
              onClick={handleCloseErrorModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}