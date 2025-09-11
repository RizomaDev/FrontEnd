import React, { useState } from "react";
import { deleteBookmark } from "../../../service/apiService";
import { useNavigate } from "react-router-dom";

export default function FormDeleteBookmark({id_bookmark}) {
    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteBookmark = async () => {
        setIsLoading(true);
        try {
            const result = await deleteBookmark(id_bookmark)
            if (result) {
                setShowDeleteModal(false);
                navigate("/HomePage");
            } else {
                alert("Error al eliminar el marcador");
            }
        } catch (error) {
            alert("Error al eliminar el marcador");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="">
            <dialog id="success_modal" className={`modal ${showDeleteModal ? 'modal-open' : ''}`}>
                <div className="modal-box bg-warning text-black text-center p-8 rounded-lg shadow-lg">
                    <h2 className="font-bold text-2xl">¿Estás seguro de querer eliminar este marcador?</h2>
                    <p className="py-4 text-lg">Si eliminas el marcador, se perderá toda la información.</p>
                    <div className="modal-action">
                        <button
                            className="btn btn-primary text-white px-6 py-2 rounded-lg"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            NO  
                        </button>
                        <button
                            className="btn btn-secondary text-black px-6 py-2 rounded-lg"
                            onClick={handleDeleteBookmark}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    
                                </>
                            ) : (
                                "SÍ"
                            )}
                        </button>
                    </div>
                </div>
            </dialog>
            <div className="card-body p-0 flex items-center justify-center">
                <button className="btn btn-neutral text-error-content w-full" onClick={() => {setShowDeleteModal(true)} }>Delete this Bookmark</button>
            </div>
        </div>
    );
}