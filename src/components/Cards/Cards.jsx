import { Link } from "react-router-dom";
import CategoryIcon from '../MapInteractive/CategoryIcon';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../constants/mapConstants';

export default function Cards({ title, category, tag, address, img, id }) {
  const categoryLower = category ? category.toLowerCase() : '';
  const backgroundColor = CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;

  return (
    <div className="card bg-base-100 w-full shadow-sm">
      <figure className="relative h-48">
        <img src={img} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2">
          <CategoryIcon 
            category={category} 
            tag={tag} 
            size="md"
          />
        </div>
      </figure>
      <div className="card-body">
        <h2 className="card-title text-neutral">{title}</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <span 
            className="badge"
            style={{ 
              backgroundColor: backgroundColor,
              color: 'white',
              border: 'none'
            }}
          >
            {category}
          </span>
          <span 
            className="badge"
            style={{ 
              backgroundColor: 'oklch(0.7036 0.0814 186.26)',
              color: 'white',
              border: 'none'
            }}
          >
            {tag}
          </span>
        </div>
        <p className="text-primary font-semibold text-sm mt-2">
          {address && address !== "Dirección no disponible"
            ? (() => {
                const parts = address.split(',').map(p => p.trim());
                const filtered = parts.filter(Boolean);
                const noPostcode = filtered.filter(p => !/^\d{5}$/.test(p));
                const noCountry = noPostcode.filter(p => !/^(Spain|España)$/i.test(p));
                if (noCountry.length >= 3) {
                  let street = noCountry[0].replace(/\b\d+\b/g, '').replace(/\s{2,}/g, ' ').trim();
                  const province = noCountry[noCountry.length - 2];
                  const city = noCountry[noCountry.length - 3];
                  const result = `${street}, ${city}, ${province}`;
                  return result.replace(/^,\s*/, '').trim();
                } else {
                  return noCountry.join(', ').replace(/^,\s*/, '').trim();
                }
              })()
            : "Sin dirección disponible"}
        </p>
        <div className="card-actions justify-end mt-4">
          <Link 
            to={`/BookmarkDetails/${id}`} 
            className="btn btn-primary text-white"
          >
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
}