import {useEffect} from "react";

export function useCloseOnHandScroll({
                                         scrollRef,
                                         isOpen,
                                         closePopup,
                                     }) {
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const node = scrollRef.current;

        if (!node) {
            return;
        }

        const handleUserScrollIntent = () => {
            closePopup();
        };

        const handleKeyDown = (e) => {
            const scrollKeys = [
                "ArrowUp",
                "ArrowDown",
                "PageUp",
                "PageDown",
                "Home",
                "End",
                " ",
                "Space",
                "Spacebar",
            ];

            if (scrollKeys.includes(e.key)) {
                closePopup();
            }
        };

        node.addEventListener(
            "wheel",
            handleUserScrollIntent,
            { passive: true }
        );

        node.addEventListener(
            "touchmove",
            handleUserScrollIntent,
            { passive: true }
        );

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            node.removeEventListener(
                "wheel",
                handleUserScrollIntent
            );

            node.removeEventListener(
                "touchmove",
                handleUserScrollIntent
            );

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        scrollRef,
        isOpen,
        closePopup,
    ]);
}