import {useEffect} from "react";

export function useDeleteKey(callback) {

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Delete") {
                callback();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [callback]);
}