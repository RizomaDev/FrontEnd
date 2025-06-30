import React from "react";
import LocationAutocomplete from "../../LocationAutocomplete/LocationAutocomplete";

export default function BookmarkPlanningContact({ register, errors, setValue, getValues }) {
  // Obtener valores actuales si existen
  const currentLat = getValues ? getValues("latitude") : "";
  const currentLon = getValues ? getValues("longitude") : "";

  const handleSelect = ({ lat, lon }) => {
    setValue("latitude", lat);
    setValue("longitude", lon);
  };

  return (
    <>
      <div className="form-control w-full max-w-md mb-4 text-left">
        <label className="label">
          <span className="label-text font-semibold">Ubicación <span className="text-error">*</span></span>
        </label>
        <LocationAutocomplete onSelect={handleSelect} />
        {errors.latitude && (
          <span className="text-error text-sm mt-1">{errors.latitude.message}</span>
        )}
        {errors.longitude && (
          <span className="text-error text-sm mt-1">{errors.longitude.message}</span>
        )}
        {/* Mostrar valores actuales si existen */}
        {(currentLat || currentLon) && (
          <div className="mt-2 text-xs text-gray-500">Lat: {currentLat} | Lon: {currentLon}</div>
        )}
      </div>
    </>
  );
} 