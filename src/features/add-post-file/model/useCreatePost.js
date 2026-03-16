import { useState } from 'react';
import { uploadPost } from '@features/add-post-file/api/uploadPost.js';
import { usePostFile } from '@features/add-post-file/model/usePostFile.js';

export function useCreatePost() {
    const {
        fileInputRef,
        fileUrl,
        fileType,
        file,
        setFile,
        handleBlockClick,
        handleFileChange,
        handleRemoveFile,
    } = usePostFile();

    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        try {
            setError(null);
            setLoading(true);

            await uploadPost({ description, file });

            setDescription('');
            setFile(null);
            handleRemoveFile();
        } catch (err) {
            setError(err.message);
            throw err;
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
