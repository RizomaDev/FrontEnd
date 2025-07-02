import React from "react";
import { Link } from "react-router-dom";

export default function Cards({ title, category, tag, address, img, id }) {
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
          {address && address !== "Dirección no disponible"
            ? (() => {
                const parts = address.split(',').map(p => p.trim());
                const filtered = parts.filter(Boolean);
                const noPostcode = filtered.filter(p => !/^\d{5}$/.test(p));
                const noCountry = noPostcode.filter(p => !/^(Spain|España)$/i.test(p));
                if (noCountry.length >= 3) {
                  // Eliminar cualquier número aislado en la parte de la calle
                  let street = noCountry[0].replace(/\b\d+\b/g, '').replace(/\s{2,}/g, ' ').trim();
                  const province = noCountry[noCountry.length - 2];
                  const city = noCountry[noCountry.length - 3];
                  const result = `${street}, ${city}, ${province}`;
                  // Eliminar cualquier coma al inicio y espacios extras
                  return result.replace(/^,\s*/, '').trim();
                } else {
                  // Eliminar cualquier coma al inicio y espacios extras
                  return noCountry.join(', ').replace(/^,\s*/, '').trim();
                }
              })()
            : "Sin dirección disponible"}
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