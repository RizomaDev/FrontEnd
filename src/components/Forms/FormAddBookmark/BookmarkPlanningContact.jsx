import React from "react";

export default function BookmarkPlanningContact({ register, errors }) {
  return (
    <>
      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">Latitud <span className="text-error">*</span></span>
        </label>
        <input
          type="number"
          step="any"
          className="input input-bordered w-full"
          {...register("latitude", { required: "La latitud es obligatoria." })}
        />
        {errors.latitude && (
          <span className="text-error text-sm mt-1">{errors.latitude.message}</span>
        )}
      </div>
      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">Longitude <span className="text-error">*</span></span>
        </label>
        <input
          type="number"
          step="any"
          className="input input-bordered w-full"
          {...register("longitude", { required: "Longitude is required." })}
        />
        {errors.longitude && (
          <span className="text-error text-sm mt-1">{errors.longitude.message}</span>
        )}
      </div>
    </>
  );
} 