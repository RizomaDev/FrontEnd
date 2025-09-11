import React, { useState, useRef } from 'react';

const CLOUD_NAME = 'dqbvfsxfg';
const UPLOAD_PRESET = 'ml_default';

const VideoUpload = ({ onVideoUrlReceived }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const abortController = useRef(null);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('O arquivo é muito grande. O tamanho máximo é 100MB.');
            return;
        }

        setSelectedFile(file);
        setError(null);
        setUploadSuccess(false);
        setUploadedUrl(null);

        const videoUrl = URL.createObjectURL(file);
        setPreview(videoUrl);
    };

    const cancelUpload = () => {
        if (abortController.current) {
            abortController.current.abort();
            setUploading(false);
            setProgress(0);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError(null);
        setUploadSuccess(false);
        
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', UPLOAD_PRESET);
            formData.append('cloud_name', CLOUD_NAME);

            abortController.current = new AbortController();

            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setProgress(percentComplete);
                }
            });

            const uploadPromise = new Promise((resolve, reject) => {
                xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);
                
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

            const data = await uploadPromise;

            if (data.error) {
                throw new Error(data.error.message);
            }

            setUploadedUrl(data.secure_url);
            onVideoUrlReceived(data.secure_url);
            setProgress(100);
            setUploadSuccess(true);
        } catch (err) {
            if (err.name === 'AbortError') {
                setError('Upload cancelado');
            } else {
                setError(err.message);
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="file-input file-input-bordered w-full"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                        Tamanho máximo: 100MB
                    </p>
                </div>
            ) : (
                <div className="bg-base-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="font-semibold">{selectedFile.name}</p>
                            <p className="text-sm text-gray-500">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                        {!uploading && !uploadSuccess && (
                            <button 
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreview(null);
                                    setUploadedUrl(null);
                                    setUploadSuccess(false);
                                }}
                                className="btn btn-ghost btn-sm"
                            >
                                Remover
                            </button>
                        )}
                    </div>

                    {uploadSuccess && (
                        <div className="alert alert-success mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Vídeo enviado com sucesso!</span>
                        </div>
                    )}

                    <video 
                        src={uploadedUrl || preview} 
                        controls 
                        className="w-full max-h-48 object-contain mb-4 rounded"
                    />

                    {!uploadSuccess && (
                        !uploading ? (
                            <button 
                                onClick={handleUpload}
                                className="btn btn-primary w-full"
                            >
                                Iniciar Upload
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">{progress}% completado</span>
                                    <button 
                                        onClick={cancelUpload}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                                <progress 
                                    className="progress progress-primary w-full" 
                                    value={progress} 
                                    max="100"
                                />
                            </div>
                        )
                    )}
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default VideoUpload; 