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
    <div className="marker-form-container">
      <h3 className="marker-form-title">Agregar Marcador</h3>
      <p className="marker-form-coordinates">Coordenadas: {position[0]}, {position[1]}</p>
      <form onSubmit={handleSubmit} className="marker-form">
        <div className="marker-form-group">
          <label htmlFor="title" className="marker-form-label">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="marker-form-input"
          />
        </div>
        <div className="marker-form-group">
          <label htmlFor="description" className="marker-form-label">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="marker-form-input"
          />
        </div>
        <div className="marker-form-group">
          <label htmlFor="tag" className="marker-form-label">Tag:</label>
          <input
            type="text"
            id="tag"
            name="tag"
            value={formData.tag}
            onChange={handleInputChange}
            required
            className="marker-form-input"
          />
        </div>
        <div className="marker-form-group">
          <label htmlFor="file" className="marker-form-label">Subir Imagen o Archivo:</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="marker-form-input"
          />
        </div>
        <div className="marker-form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="marker-form-button marker-form-button-cancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="marker-form-button marker-form-button-submit"
          >
            Crear marcador
          </button>
        </div>
      </form>
    </div>
  );
} 