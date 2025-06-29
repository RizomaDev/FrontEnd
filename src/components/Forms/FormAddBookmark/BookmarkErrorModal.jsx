import React from "react";

export default function BookmarkErrorModal({ show, errorMessage, onClose }) {
  if (!show) return null;
  return (
    <dialog open className="modal modal-open">
      <div className="modal-box bg-error text-white text-center p-8 rounded-lg shadow-lg">
        <h3 className="font-bold text-2xl">Error!</h3>
        <p className="py-4 text-lg">{errorMessage}</p>
        <div className="modal-action">
          <button
            className="btn btn-neutral text-white px-6 py-2 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
} 