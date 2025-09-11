import React, { useState } from "react";
import VideoUpload from "../../VideoUpload/VideoUpload";

export default function BookmarkAdditionalInfo({ register, errors, setValue, watch }) {
  const handleVideoUrlReceived = (url) => {
    setValue("video", url);
  };

  const descriptionValue = watch("description") || "";
  const characterCount = descriptionValue.length;
  const maxCharacters = 250;
  const isNearLimit = characterCount > maxCharacters * 0.8; // 80% del límite
  const isOverLimit = characterCount > maxCharacters;

  return (
    <>
      <div className="form-control w-full max-w-md text-left">
        <label className="label">
          <span className="label-text font-semibold">
            Descripción del marcador (min. 100, máx. 250 caracteres) <span className="text-error">*</span>
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24 w-full"
          placeholder="Proporciona una descripción detallada del marcador..."
          {...register("description", {
            required: "La descripción es requerida.",
            minLength: { value: 100, message: "La descripción debe tener al menos 100 caracteres." },
            maxLength: { value: 250, message: "La descripción no puede tener más de 250 caracteres." }
          })}
        ></textarea>
        <div className={`flex justify-between items-center ${errors.description ? 'mt-2' : 'mt-1'}`}>
          <div className="text-sm">
            {errors.description && (
              <span className="text-error">
                {errors.description.message}
              </span>
            )}
          </div>
          <div className={`text-sm font-medium ${
            isOverLimit ? 'text-error' : 
            isNearLimit ? 'text-warning' : 
            'text-base-content/60'
          }`}>
            {characterCount}/{maxCharacters}
          </div>
        </div>
      </div>
      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">Información adicional (URL)</span>
        </label>
        <input
          type="url"
          className="input input-bordered w-full"
          placeholder="https://ejemplo.com"
          {...register("url", {
            pattern: {
              value: /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i,
              message: "Introduce una URL válida."
            }
          })}
        />
        {errors.url && (
          <span className="text-error text-sm mt-1">{errors.url.message}</span>
        )}
      </div>
      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">Video</span>
        </label>
        <VideoUpload onVideoUrlReceived={handleVideoUrlReceived} />
        <input
          type="hidden"
          {...register("video")}
        />
        {errors.video && (
          <span className="text-error text-sm mt-1">{errors.video.message}</span>
        )}
      </div>
    </>
  );
} 