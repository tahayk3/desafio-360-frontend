import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const UploadForm = ({ onUploadSuccess, onRemoveImage, multiple = false, type = 'image' }) => {
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.filter(
            (file) => !files.some((existingFile) => existingFile.name === file.name)
        );

        setFiles(prevFiles => [...prevFiles, ...newFiles]);
        const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (files.length === 0) return;

        const uploadPromises = files.map(file => {
            const storeRef = ref(storage, `uploads/${file.name}`);
            const uploadTask = uploadBytesResumable(storeRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        setProgress(progress);
                    },
                    (error) => {
                        console.error("Error uploading file:", error);
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve({ url: downloadURL, name: file.name });
                        });
                    }
                );
            });
        });

        Promise.all(uploadPromises).then((urls) => {
            if (onUploadSuccess) {
                onUploadSuccess(urls); // Pasar objetos con URL y nombre
            }
        }).catch((error) => {
            console.error("Error uploading files:", error);
        });
    };

    const handleRemoveFile = (index) => {
        const fileToRemove = files[index];
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
        if (onRemoveImage) {
            onRemoveImage(fileToRemove.name); // Pasar el nombre del archivo al componente padre
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} multiple={multiple} />
            <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                {previewUrls.map((url, index) => (
                    <div key={index} style={{ position: "relative" }}>
                        <img
                            src={url}
                            alt={`preview ${index}`}
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                background: "red",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={handleUpload}>Subir {type}</button>
            <div>Subida en progreso: {progress}%</div>
        </div>
    );
};

export default UploadForm;
