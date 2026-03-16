import { useCallback, useEffect, useState } from "react";

export function useAsyncResource(loader, deps = [], initialData = null) {
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await loader();
            setData(result);
            return result;
        } catch (requestError) {
            setError(requestError);
            throw requestError;
        } finally {
            setIsLoading(false);
        }
    }, deps);

    useEffect(() => {
        execute().catch((requestError) => {
            console.error(requestError);
        });
    }, [execute]);

    return {
        data,
        isLoading,
        error,
        reload: execute,
    };
}
