import React, { useState, useRef, useEffect } from 'react';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dqbvfsxfg';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

const ImageUpload = ({ onImagesReceived, maxImages = 3, initialImages = [] }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState(initialImages);
    const [uploadSuccess, setUploadSuccess] = useState(initialImages.length > 0);
    const abortController = useRef(null);

    useEffect(() => {
        if (initialImages.length > 0) {
            onImagesReceived(initialImages);
        }
    }, [initialImages, onImagesReceived]);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileSelect = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        const maxSize = 10 * 1024 * 1024;
        const validFiles = [];
        const invalidFiles = [];

        files.forEach(file => {
            if (file.size > maxSize) {
                invalidFiles.push(`${file.name} (muito grande)`);
            } else if (!file.type.startsWith('image/')) {
                invalidFiles.push(`${file.name} (não é uma imagem)`);
            } else {
                validFiles.push(file);
            }
        });

        if (invalidFiles.length > 0) {
            setError(`Archivos inválidos: ${invalidFiles.join(', ')}`);
            return;
        }

        if (validFiles.length > maxImages) {
            setError(`Máximo de ${maxImages} imágenes permitidas`);
            return;
        }

        setSelectedFiles(validFiles);
        setError(null);
        setUploadSuccess(false);
        setUploadedUrls([]);

        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
        await uploadImagesAutomatically(validFiles);
    };

    const cancelUpload = () => {
        if (abortController.current) {
            abortController.current.abort();
            setUploading(false);
            setProgress(0);
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('cloud_name', CLOUD_NAME);

        const xhr = new XMLHttpRequest();
        
        return new Promise((resolve, reject) => {
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setProgress(percentComplete);
                }
            });

            xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(new Error('Upload failed'));
                }
            };
            
            xhr.onerror = () => reject(new Error('Upload failed'));
            xhr.send(formData);
        });
    };

    const uploadImagesAutomatically = async (files) => {
        if (!files.length) return;

        setUploading(true);
        setError(null);
        setUploadSuccess(false);
        
        try {
            const uploadPromises = files.map(file => uploadImage(file));
            const results = await Promise.all(uploadPromises);

            const urls = results.map(result => {
                if (result.error) {
                    throw new Error(result.error.message);
                }
                return result.secure_url;
            });

            setUploadedUrls(urls);
            onImagesReceived(urls);
            setProgress(100);
            setUploadSuccess(true);
        } catch (err) {
            if (err.name === 'AbortError') {
                setError('Subida cancelada');
            } else {
                setError(`Error al subir imágenes: ${err.message}`);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = async () => {
        await uploadImagesAutomatically(selectedFiles);
    };

    const clearFiles = () => {
        setSelectedFiles([]);
        setPreviews([]);
        setUploadedUrls([]);
        setUploadSuccess(false);
        setError(null);
        setProgress(0);
        onImagesReceived([]);
    };

    return (
        <div className="w-full">
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">
                        Seleccionar Imágenes (mínimo 1, máximo {maxImages}) <span className="text-error">*</span>
                    </span>
                </label>
                
                <div className="p-6 text-center">
                    <input
                        type="file"
                        className="file-input file-input-bordered w-full"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                </div>
                
                {selectedFiles.length > 0 && (
                    <div className="bg-base-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{selectedFiles.length} archivo(s) seleccionado(s)</p>
                                <p className="text-sm text-gray-500 truncate">
                                    {selectedFiles.map(file => file.name).join(', ')}
                                </p>
                            </div>
                            {!uploading && (
                                <button 
                                    onClick={clearFiles}
                                    disabled={uploading}
                                    className="btn btn-ghost btn-sm flex-shrink-0"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                        
                        <div className={`mb-4 ${
                            selectedFiles.length === 1 
                                ? 'flex justify-center' 
                                : selectedFiles.length === 2 
                                    ? 'grid grid-cols-2 gap-2' 
                                    : 'grid grid-cols-3 gap-2'
                        }`}>
                            {previews.map((preview, index) => (
                                <div key={index} className={`relative ${
                                    selectedFiles.length === 1 ? 'max-w-xs' : ''
                                }`}>
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded border"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center gap-2">
                            
                            {uploading && (
                                <button
                                    type="button"
                                    onClick={cancelUpload}
                                    className="btn btn-error btn-sm"
                                >
                                    Cancelar subida
                                </button>
                            )}
                        </div>

                        {uploading && (
                            <div className="mt-2">
                                <div className="text-center text-sm mb-2 text-primary">
                                    Subiendo imágenes...
                                </div>
                                <progress 
                                    className="progress progress-primary w-full" 
                                    value={progress} 
                                    max="100"
                                />
                                <div className="text-center text-sm mt-1">{progress}%</div>
                            </div>
                        )}

                        {uploadSuccess && uploadedUrls.length > 0 && (
                            <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
                                <div className="flex items-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5 text-success" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-medium text-success">
                                        {uploadedUrls.length} imagen(es) {initialImages.length > 0 ? 'cargada(s)' : 'subida(s)'}
                                    </span>
                                </div>
                                <div className="text-xs text-base-content/60">
                                    {initialImages.length > 0 ? 'Las imágenes están cargadas.' : 'Las imágenes se han guardado'}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="alert alert-error mt-2">
                        <span className="text-sm">{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
