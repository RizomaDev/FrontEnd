import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createBookmark } from "../../../service/apiService";
import { useNavigate } from "react-router-dom";
import BookmarkBasicInfo from "./BookmarkBasicInfo";
import BookmarkAdditionalInfo from "./BookmarkAdditionalInfo";
import BookmarkPlanningContact from "./BookmarkLocation";
import BookmarkSuccessModal from "./BookmarkSuccessModal";
import BookmarkErrorModal from "./BookmarkErrorModal";
import { useAddBookmarkForm } from "../../../hooks/useAddBookmarkForm";
import { buildBookmarkPayloadSimple } from "../../../utils/bookmarkPayloadBuilder";
import ImageUpload from "../../ImageUpload/ImageUpload";
import BookmarkSummary from "./BookmarkSummary";

export default function FormAddBookmark() {
  const navigate = useNavigate();
  const [newBookmarkId, setNewBookmarkId] = useState(null);
  const [newBookmarkLocation, setNewBookmarkLocation] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImagesReceived = (urls) => {
    setImageUrls(urls);
    if (urls.length > 0) {
      clearErrors("images");
    }
  };

  const { register, handleSubmit: formHandleSubmit, formState: { errors }, reset, setError, clearErrors, setValue, getValues, watch } = useForm();
  const {
    tags, categories,
    loadingTags, loadingCategories,
    tagsError, categoriesError,
    showSuccessModal, setShowSuccessModal,
    showErrorModal, setShowErrorModal,
    errorMessage, setErrorMessage,
  } = useAddBookmarkForm();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const validateStep1 = (data) => {
    let valid = true;
    if (!data.title) valid = false;
    if (!data.tagId) valid = false;
    if (!data.categoryId) valid = false;
    return valid;
  };

  const validateStep2 = (data) => {
    let valid = true;
    if (!data.description || data.description.length < 100) valid = false;
  
    return valid;
  };

  const validateStep3 = (data) => {
    return true;
  };

  const validateStep4 = (data) => {
    return true;
  };

  const onNext = (data) => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = validateStep1(data);
    } else if (currentStep === 2) {
      // Validar descripción Y imágenes
      const descriptionValid = validateStep2(data);
      if (imageUrls.length < 1) {
        setError("images", { type: "manual", message: "Se requiere minimo 1 imagen. Por favor, sube al menos una imagen." });
        isValid = false;
      } else {
        clearErrors("images");
        isValid = descriptionValid;
      }
    } else if (currentStep === 3) {
      isValid = validateStep3(data);
    } else if (currentStep === 4) {
      isValid = validateStep4(data);
    } else if (currentStep > 4) {
      isValid = true;
    }
    
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const onPrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    if (newBookmarkLocation && newBookmarkId) {
      navigate("/MapView", { 
        state: { 
          center: [newBookmarkLocation.latitude, newBookmarkLocation.longitude],
          zoom: 15,
          focusedBookmarkId: newBookmarkId
        } 
      });
    } else {
      navigate("/HomePage");
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = buildBookmarkPayloadSimple({
        ...data,
        imageUrls: imageUrls 
      });
      
      const response = await createBookmark(payload);
      setNewBookmarkId(response.id);
      setNewBookmarkLocation(payload.location);
      setShowSuccessModal(true);
      reset();
      setImageUrls([]); 
    } catch (error) {
      setErrorMessage(error.message || "Error adding bookmark");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 [filter:sepia(20%)]"
      style={{
        backgroundImage:
          "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
      }}
    >
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl p-8 rounded-lg">
        <div className="card-body items-center text-center p-0">
          <h2 className="card-title text-4xl font-bold text-primary mb-8">
            Añadir un nuevo marcador
          </h2>

          <ul className="steps steps-vertical lg:steps-horizontal w-full mb-8 font-semibold">
            <li className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>Detalles del marcador</li>
            <li className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>Información adicional</li>
            <li className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>Localización</li>
            <li className={`step ${currentStep >= 4 ? "step-primary" : ""}`}>Confirmación</li>
          </ul>

          <form onSubmit={formHandleSubmit(currentStep === totalSteps ? onSubmit : onNext)} className="w-full">
            {currentStep === 1 && (
              <div className="flex flex-col items-center">
                <h3 className="text-3xl font-bold text-secondary mb-5 w-full text-center">Detalles del marcador</h3>
                <BookmarkBasicInfo
                  register={register}
                  errors={errors}
                  tags={tags || []}
                  categories={categories}
                  loadingTags={loadingTags}
                  tagsError={tagsError}
                  loadingCategories={loadingCategories}
                  categoriesError={categoriesError}
                  watch={watch}
                />
                
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-semibold text-secondary mb-5 w-full text-center">Información adicional</h3>
                <BookmarkAdditionalInfo 
                  register={register} 
                  errors={errors} 
                  setValue={setValue} 
                  watch={watch}
                  onImagesReceived={handleImagesReceived}
                  imageUrls={imageUrls}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-semibold text-secondary mb-5 w-full text-center">Localización</h3>
                <BookmarkPlanningContact register={register} errors={errors} setValue={setValue} getValues={getValues} />
              </div>
            )}

            {currentStep === 4 && (
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-semibold text-secondary mb-5 w-full text-center">Confirmación</h3>
                <BookmarkSummary 
                  data={{
                    ...getValues(),
                    imageUrls: imageUrls
                  }} 
                  categories={categories} 
                  tags={tags || []}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                />
                <p className="mt-6 text-base-content/70">
                  Revisa tu información y haz clic en <b>Añadir marcador</b> para enviarlo.
                </p>
              </div>
            )}

            <div className="form-control w-full max-w-md mb-6 flex gap-4 mt-6 mx-auto">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={onPrevious}
                  className="btn btn-secondary flex-1"
                >
                  Back
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={formHandleSubmit(onNext)}
                  className="btn btn-primary flex-1"
                >
                  Next
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn btn-primary flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      
                    </>
                  ) : (
                    "Añadir marcador"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <BookmarkSuccessModal 
        show={showSuccessModal} 
        onClose={handleCloseSuccessModal}
        hasLocation={!!newBookmarkLocation}
      />
      <BookmarkErrorModal 
        show={showErrorModal} 
        errorMessage={errorMessage} 
        onClose={() => setShowErrorModal(false)} 
      />
    </div>
  );
}
