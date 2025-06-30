import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

export default function Cards({ title, category, tag, location, img, id }) {
  const [locationName, setLocationName] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    const fetchLocationName = async () => {
      if (
        location &&
        typeof location === "object" &&
        location.latitude !== undefined &&
        location.longitude !== undefined &&
        location.latitude !== null &&
        location.longitude !== null
      ) {
        setLoadingLocation(true);
        try {
          const proxyUrl = "https://corsproxy.io/?";
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`;
          const response = await fetch(proxyUrl + encodeURIComponent(url));
          if (!response.ok) throw new Error("Error al obtener la ubicación");
          const data = await response.json();
          setLocationName(data.display_name || "");
        } catch (error) {
          setLocationName("");
        } finally {
          setLoadingLocation(false);
        }
      } else if (typeof location === "string" && location.trim() !== "") {
        setLocationName(location);
        setLoadingLocation(false);
      } else {
        setLocationName("");
        setLoadingLocation(false);
      }
    };
    fetchLocationName();
  }, [location]);

  return (
   
    <div className="card bg-base-100 w-full shadow-sm">
      <figure>
        <img src={img} alt={title} className="w-full h-48 object-cover" /> 
      </figure>
      <div className="card-body">
        <h2 className="card-title text-neutral">{title}</h2>

        <p className="text-secondary">{category}</p>
        <p className="text-secondary">{tag}</p>
       
        <p className="text-primary font-semibold text-sm mt-2">
          {loadingLocation
            ? "Buscando ubicación..."
            : locationName || "Sin ubicación disponible"}
        </p> 
        <div className="card-actions justify-end mt-4"> 
           <Link to={`/BookmarkDetails/${id}`} className="btn btn-primary">
            Ver más
          </Link>
        
        </div>
      </div>
    </div>
  );
}