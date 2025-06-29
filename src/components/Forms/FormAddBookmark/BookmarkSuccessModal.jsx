import React from "react";

export default function BookmarkSuccessModal({ show, onClose }) {
  if (!show) return null;
  return (
    <dialog open className="modal modal-open">
      <div className="modal-box bg-warning text-black text-center p-8 rounded-lg shadow-lg">
        <h3 className="font-bold text-2xl">Bookmark Added Successfully!</h3>
        <p className="py-4 text-lg">Your bookmark has been added successfully.</p>
        <div className="modal-action">
          <button
            className="btn btn-success text-white px-6 py-2 rounded-lg"
            onClick={onClose}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </dialog>
  );
} 