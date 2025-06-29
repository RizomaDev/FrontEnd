import React from "react";

export default function BookmarkAdditionalInfo({ register, errors }) {
  return (
    <>
      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">
            Description of the Bookmark (min. 100 characters) <span className="text-error">*</span>
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24 w-full"
          placeholder="Provide a detailed description of the bookmark..."
          {...register("description", {
            required: "Description is required.",
            minLength: { value: 100, message: "Description must be at least 100 characters long." }
          })}
        ></textarea>
        {errors.description && (
          <span className="text-error text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>
    </>
  );
} 