import { useState } from "react";
import { uploadPost } from "@features/add-post-file/uploadPostFeature.jsx";
import { useAddPostFileFeature } from "@features/add-post-file/addPostFile.jsx";

export function useCreatePostFeature() {
    const {
        fileInputRef,
        fileUrl,
        fileType,
        file,
        setFile,
        handleBlockClick,
        handleFileChange,
        handleRemoveFile,
    } = useAddPostFileFeature();

    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        try {
            setError(null);
            setLoading(true);
            const result = await uploadPost({ description, file });

            console.log("✅ Post uploaded successfully:", result);

            setDescription("");
            setFile(null);
            handleRemoveFile();
        } catch (err) {
            console.error("❌ Upload failed:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        description,
        setDescription,
        loading,
        error,
        file,
        fileInputRef,
        fileUrl,
        fileType,
        handleBlockClick,
        handleFileChange,
        handleRemoveFile,

        handleSubmit,
    };
}
