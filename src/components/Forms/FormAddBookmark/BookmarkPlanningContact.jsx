import React from "react";

export default function BookmarkPlanningContact({ register, errors }) {
  return (
    <>
      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">Itinerary</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-20 w-full"
          placeholder="Describe the itinerary (optional)"
          {...register("itinerary")}
        ></textarea>
      </div>

      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">Observations</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-20 w-full"
          placeholder="Any special observations? (optional)"
          {...register("observation")}
        ></textarea>
      </div>

      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">Latitude <span className="text-error">*</span></span>
        </label>
        <input
          type="number"
          step="any"
          className="input input-bordered w-full"
          {...register("latitude", { required: "Latitude is required." })}
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