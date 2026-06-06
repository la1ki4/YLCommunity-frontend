import {useEffect} from "react";

export function useClosePopupOnZoom({
                                        isEnabled,
                                        onClose,
                                    }) {
    useEffect(() => {
        if (!isEnabled) {
            return;
        }

        const closePopup = () => {
            onClose?.();
        };

        const handleWheel = (event) => {
            if (event.ctrlKey) {
                closePopup();
            }
        };

        const handleKeyDown = (event) => {
            if (
                event.ctrlKey &&
                [
                    "Equal",
                    "Minus",
                    "NumpadAdd",
                    "NumpadSubtract",
                ].includes(event.code)
            ) {
                closePopup();
            }
        };

        const handleGesture = () => {
            closePopup();
        };

        document.addEventListener("wheel", handleWheel, {
            passive: true,
        });

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        document.addEventListener(
            "gesturestart",
            handleGesture
        );

        document.addEventListener(
            "gesturechange",
            handleGesture
        );

        document.addEventListener(
            "gestureend",
            handleGesture
        );

        return () => {
            document.removeEventListener(
                "wheel",
                handleWheel
            );

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.removeEventListener(
                "gesturestart",
                handleGesture
            );

            document.removeEventListener(
                "gesturechange",
                handleGesture
            );

            document.removeEventListener(
                "gestureend",
                handleGesture
            );
        };
    }, [isEnabled, onClose]);
}