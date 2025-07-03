import React from 'react';
import { Popup } from 'react-leaflet';      
import Buttons from '../Buttons/Buttons';


export default function BookmarkPopup({ marker }) {
  return (
    <Popup>
      <div className="max-w-sm">
      <div className="mt-2">
          <span className="badge badge-secondary">{marker.category}</span>
          <span className="badge badge-primary ml-2">{marker.tag}</span>
        </div>
        <h3 className="font-bold text-lg">{marker.title}</h3>
        <p className="text-sm mt-2">{marker.description}</p>
       
        {(marker.imageUrls && marker.imageUrls.length > 0) ? (
          <img
            src={`http://localhost:8080/api/images/${marker.imageUrls[0].split('/').pop()}`}
            alt={marker.title}
            className="w-full h-32 object-cover mt-2 rounded"
          />
        ) : marker.imageFile && (
          <img
            src={URL.createObjectURL(marker.imageFile)}
            alt={marker.title}
            className="w-full h-32 object-cover mt-2 rounded"
          />
        )}
        {marker.id && (
          <div className="mt-4 flex justify-end text-black">
            <Buttons
              to={`/BookmarkDetails/${marker.id}`}
              className="border-none sm:btn-sm"
              style={{
                backgroundColor: "info",
                color: "black",
              }}
            >
              {"Ver más detalles"}
            </Buttons>
          </div>
        )}
      </div>
    </Popup>
  );
} 