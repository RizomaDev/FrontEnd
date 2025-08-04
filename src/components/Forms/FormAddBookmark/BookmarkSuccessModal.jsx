import React from "react";

export default function BookmarkSuccessModal({ show, onClose, hasLocation }) {
  if (!show) return null;
  return (
    <dialog open className="modal modal-open">
      <div className="modal-box bg-warning text-black text-center p-8 rounded-lg shadow-lg">
        <h3 className="font-bold text-2xl">¡Marcador añadido correctamente!</h3>
        <p className="py-4 text-lg">Tu marcador ha sido añadido correctamente.</p>
        <div className="modal-action">
          <button
            className="btn btn-success text-white px-6 py-2 rounded-lg"
            onClick={onClose}
          >
            {hasLocation ? 'Ver en el mapa' : 'Ir a la página de inicio'}
          </button>
        </div>
      </div>
    </dialog>
  );
} 