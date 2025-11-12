import { useRef, useState } from "react";
export function useAddPostFileFeature() {
    const fileInputRef = useRef(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [file, setFile] = useState(null);

    const handleBlockClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        const url = URL.createObjectURL(selectedFile);
        setFile(selectedFile);
        setFileUrl(url);
        setFileType(selectedFile.type);
    };

    const handleRemoveFile = () => {
        setFileUrl(null);
        setFileType(null);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return {
        fileInputRef,
        file,
        setFile,
        fileUrl,
        fileType,
        handleBlockClick,
        handleFileChange,
        handleRemoveFile,
    };
}