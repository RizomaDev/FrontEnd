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
          <span className="label-text font-semibold">
            Ubicación <span className="text-error">*</span>
          </span>
        </label>
        <div className="space-y-4">
          <LocationAutocomplete 
            onSelect={handleSelect}
          />

          {errors.latitude && (
            <span className="text-error text-sm">{errors.latitude.message}</span>
          )}
          {errors.longitude && (
            <span className="text-error text-sm">{errors.longitude.message}</span>
          )}
          
          {/* Mostrar coordenadas atuais */}
          {currentLat && currentLon && (
            <div className="text-sm text-gray-500">
              Coordenadas seleccionadas: {parseFloat(currentLat).toFixed(6)}, {parseFloat(currentLon).toFixed(6)}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 