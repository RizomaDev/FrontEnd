import React, { useState, useEffect } from 'react';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../../../constants/mapConstants';
import { getLocationName } from '../../../service/mapService';

export default function BookmarkSummary({ data, categories, tags }) {
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
        <h3 className="text-2xl font-bold text-primary mb-6 text-center">Resumen del Marcador</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-base-content mb-1">Título</h4>
            <p className="text-base-content/70">{data.title}</p>
          </div>

          <div>
            <h4 className="font-semibold text-base-content mb-1">Descripción</h4>
            <p className="text-base-content/70 whitespace-pre-wrap">{data.description}</p>
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
            <p className="text-base-content/70">
              {data.images?.length || 0} imágenes seleccionadas
            </p>
          </div>

          {data.video && (
            <div>
              <h4 className="font-semibold text-base-content mb-1">Video URL</h4>
              <a href={data.video} target="_blank" rel="noopener noreferrer" 
                 className="text-primary hover:underline break-all">
                {data.video}
              </a>
            </div>
          )}

          {data.url && (
            <div>
              <h4 className="font-semibold text-base-content mb-1">URL Adicional</h4>
              <a href={data.url} target="_blank" rel="noopener noreferrer" 
                 className="text-primary hover:underline break-all">
                {data.url}
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-base-300">
          <p className="text-sm text-base-content/60 text-center">
            Por favor, revisa que toda la información sea correcta antes de crear el marcador.
          </p>
        </div>
      </div>
    </div>
  );
} 