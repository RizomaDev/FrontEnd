import React, { useState, useEffect } from 'react';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../../constants/mapConstants';
import { getLocationName } from '../../../service/mapService';

function getVideoEmbedUrl(url) {
  if (!url) return null;
  
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo
  const vimeoRegex = /vimeo\.com\/(?:.*#|.*)\/?([\d]+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  return null;
}

export default function BookmarkSummary({ data, categories, tags, register, errors, setValue }) {
  const [locationName, setLocationName] = useState('Cargando ubicación...');

  useEffect(() => {
    const fetchLocationName = async () => {
      if (data.latitude && data.longitude) {
        const name = await getLocationName(data.latitude, data.longitude);
        setLocationName(name);
      }
    };
    fetchLocationName();
  }, [data.latitude, data.longitude]);

  const categoryId = data.categoryId ? parseInt(data.categoryId, 10) : null;
  const tagId = data.tagId ? parseInt(data.tagId, 10) : null;

  const category = categories.find(c => c.id === categoryId);
  const tag = tags.find(t => t.id === tagId);

  const categoryLower = category?.name.toLowerCase() || '';
  const backgroundColor = CATEGORY_COLORS[categoryLower] || DEFAULT_CATEGORY_COLOR;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-base-200 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-primary mb-6">Resumen del Marcador</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-base-content mb-1">Título</h4>
            <p className="text-base-content/70">{data.title}</p>
            {errors.title && (
              <span className="text-error text-sm mt-1">{errors.title.message}</span>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-base-content mb-1">Descripción</h4>
            <p className="text-base-content/70 whitespace-pre-wrap">{data.description}</p>
            {errors.description && (
              <span className="text-error text-sm mt-1">{errors.description.message}</span>
            )}
          </div>

          <div className="flex justify-center items-center gap-6">
            <div className="text-center">
              <h4 className="font-semibold text-base-content mb-2">Categoría</h4>
              <span 
                className="badge badge-lg"
                style={{ 
                  backgroundColor,
                  color: 'white',
                  border: 'none'
                }}
              >
                {category?.name || 'No seleccionada'}
              </span>
              {errors.categoryId && (
                <span className="text-error text-sm block mt-1">{errors.categoryId.message}</span>
              )}
            </div>

            <div className="text-center">
              <h4 className="font-semibold text-base-content mb-2">Etiqueta</h4>
              <span 
                className="badge badge-lg"
                style={{ 
                  backgroundColor: 'oklch(0.7036 0.0814 186.26)',
                  color: 'white',
                  border: 'none'
                }}
              >
                {tag?.name || 'No seleccionada'}
              </span>
              {errors.tagId && (
                <span className="text-error text-sm block mt-1">{errors.tagId.message}</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base-content mb-1">Ubicación</h4>
            <p className="text-base-content/70">
              {locationName}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base-content mb-1">Imágenes</h4>
            {data.imageUrls && data.imageUrls.length > 0 ? (
              <div className={`mt-2 ${
                data.imageUrls.length === 1 
                  ? 'flex justify-center' 
                  : data.imageUrls.length === 2 
                    ? 'grid grid-cols-2 gap-4' 
                    : 'grid grid-cols-3 gap-4'
              }`}>
                {data.imageUrls.map((imageUrl, index) => (
                  <div key={index} className={`relative aspect-square ${
                    data.imageUrls.length === 1 ? 'max-w-xs' : ''
                  }`}>
                    <img
                      src={imageUrl}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base-content/70">No hay imágenes seleccionadas</p>
            )}
            {errors.images && (
              <span className="text-error text-sm mt-1">{errors.images.message}</span>
            )}
          </div>

          {data.video && (
            <div>
              <h4 className="font-semibold text-base-content mb-1">Video</h4>
              {getVideoEmbedUrl(data.video) ? (
                <div className="relative aspect-video w-full mt-2">
                  <iframe
                    src={getVideoEmbedUrl(data.video)}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <a href={data.video} target="_blank" rel="noopener noreferrer" 
                   className="text-primary hover:underline break-all">
                  {data.video}
                </a>
              )}
              {errors.video && (
                <span className="text-error text-sm mt-1">{errors.video.message}</span>
              )}
            </div>
          )}

          {data.url && (
            <div>
              <h4 className="font-semibold text-base-content mb-1">URL Adicional</h4>
              <a href={data.url} target="_blank" rel="noopener noreferrer" 
                 className="text-primary hover:underline break-all">
                {data.url}
              </a>
              {errors.url && (
                <span className="text-error text-sm mt-1">{errors.url.message}</span>
              )}
            </div>
          )}
        </div>


      </div>
    </div>
  );
} 