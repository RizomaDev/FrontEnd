import React from "react";

import { Link } from "react-router-dom";

export default function Cards({ title, category, location, img, id }) {
  return (
   
    <div className="card bg-base-100 w-full shadow-sm">
      <figure>
        <img src={img} alt={title} className="w-full h-48 object-cover" /> 
      </figure>
      <div className="card-body">
        <h2 className="card-title text-neutral">{title}</h2>

        <p className="text-secondary">{category}</p>
       
        <p className="text-primary font-semibold text-sm mt-2">
          {location && typeof location === "object"
            ? `Lat: ${location.latitude}, Lng: ${location.longitude}`
            : location}
        </p> 
        <div className="card-actions justify-end mt-4"> 
           <Link to={`/BookmarkDetails/${id}`} className="btn btn-primary">
            read more
          </Link>
        
        </div>
      </div>
    </div>
  );
}