import React, { useState } from 'react';

export default function MarkerForm({ position, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: '',
    imageFile: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, imageFile: e.target.files[0] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', description: '', tag: '', imageFile: null });
  };

  if (!position) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Agregar Marcador</h2>
          <p className="text-center text-sm opacity-70">
            📍 Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
          </p>
          
          <form onSubmit={handleSubmit} className="form-control gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Título</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="input input-bordered w-full"
                placeholder="Escribe un título"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Descripción</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="textarea textarea-bordered h-24"
                placeholder="Describe este lugar"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Tag</span>
              </label>
              <input
                type="text"
                id="tag"
                name="tag"
                value={formData.tag}
                onChange={handleInputChange}
                required
                className="input input-bordered w-full"
                placeholder="Añade un tag"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Subir Imagen o Archivo</span>
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
              />
            </div>

            <div className="card-actions justify-end mt-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Crear marcador
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 