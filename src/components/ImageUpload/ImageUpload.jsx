import React, { useState, useRef } from 'react';

const CLOUD_NAME = 'dqbvfsxfg';
const UPLOAD_PRESET = 'ml_default';

const ImageUpload = ({ onImagesReceived, maxImages = 10 }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploadedUrls, setUploadedUrls] = useState([]);
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
        const files = Array.from(event.target.files);
        if (!files.length) return;

        const maxSize = 10 * 1024 * 1024; // 10MB por imagem
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
            setError(`Arquivos inválidos: ${invalidFiles.join(', ')}`);
            return;
        }

        if (validFiles.length > maxImages) {
            setError(`Máximo de ${maxImages} imagens permitidas`);
            return;
        }

        setSelectedFiles(validFiles);
        setError(null);
        setUploadSuccess(false);
        setUploadedUrls([]);

        // Criar previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
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

    const handleUpload = async () => {
        if (!selectedFiles.length) return;

        setUploading(true);
        setError(null);
        setUploadSuccess(false);
        
        try {
            const uploadPromises = selectedFiles.map(file => uploadImage(file));
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
                setError('Upload cancelado');
            } else {
                setError(err.message);
                console.error('Erro no upload:', err);
            }
        } finally {
            setUploading(false);
        }
    };

    const clearFiles = () => {
        setSelectedFiles([]);
        setPreviews([]);
        setUploadedUrls([]);
        setUploadSuccess(false);
        setError(null);
        setProgress(0);
    };

    return (
        <div className="w-full">
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-semibold">
                        Selecionar Imagens (máximo {maxImages}) <span className="text-error">*</span>
                    </span>
                </label>
                
                <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                />
                
                {selectedFiles.length > 0 && (
                    <div className="mt-4">
                        <div className="text-sm text-gray-600 mb-2">
                            {selectedFiles.length} arquivo(s) selecionado(s)
                        </div>
                        
                        {/* Preview das imagens */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded border"
                                    />
                                    <div className="text-xs text-center mt-1">
                                        {formatFileSize(selectedFiles[index].size)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botões de ação */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={uploading}
                                className="btn btn-primary btn-sm"
                            >
                                {uploading ? 'Enviando...' : 'Enviar para Cloudinary'}
                            </button>
                            
                            <button
                                type="button"
                                onClick={clearFiles}
                                disabled={uploading}
                                className="btn btn-secondary btn-sm"
                            >
                                Limpar
                            </button>
                            
                            {uploading && (
                                <button
                                    type="button"
                                    onClick={cancelUpload}
                                    className="btn btn-error btn-sm"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>

                        {/* Barra de progresso */}
                        {uploading && (
                            <div className="mt-2">
                                <progress 
                                    className="progress progress-primary w-full" 
                                    value={progress} 
                                    max="100"
                                />
                                <div className="text-center text-sm mt-1">{progress}%</div>
                            </div>
                        )}

                        {/* URLs das imagens enviadas */}
                        {uploadSuccess && uploadedUrls.length > 0 && (
                            <div className="mt-4 p-3 bg-success/10 rounded border border-success/20">
                                <div className="text-success font-semibold mb-2">
                                    ✅ {uploadedUrls.length} imagem(ns) enviada(s) com sucesso!
                                </div>
                                <div className="text-xs text-gray-600">
                                    As imagens foram salvas no Cloudinary e estão prontas para uso.
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
