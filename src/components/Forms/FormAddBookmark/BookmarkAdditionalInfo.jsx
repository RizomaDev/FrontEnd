import React from "react";

export default function BookmarkAdditionalInfo({ register, errors }) {
  return (
    <>
      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">
            Descripción del marcador (min. 100 caracteres) <span className="text-error">*</span>
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24 w-full"
          placeholder="Proporciona una descripción detallada del marcador..."
          {...register("description", {
            required: "La descripción es requerida.",
            minLength: { value: 100, message: "La descripción debe tener al menos 100 caracteres." }
          })}
        ></textarea>
        {errors.description && (
          <span className="text-error text-sm mt-1">
            {errors.description.message}
          </span>
        )}
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
          <span className="label-text font-semibold">Video (URL)</span>
        </label>
        <input
          type="url"
          className="input input-bordered w-full"
          placeholder="https://youtube.com/..."
          {...register("video", {
            pattern: {
              value: /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i,
              message: "Introduce una URL válida."
            }
          })}
        />
        {errors.video && (
          <span className="text-error text-sm mt-1">{errors.video.message}</span>
        )}
      </div>
    </>
  );
} 