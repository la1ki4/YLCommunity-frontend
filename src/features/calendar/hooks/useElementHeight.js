import { useEffect, useState } from "react";

export function useElementHeight(ref) {
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const update = () => {
            const next = el.getBoundingClientRect().height;
            setHeight(next);
        };
        update();

        const ro = new ResizeObserver(update);
        ro.observe(el);
        window.addEventListener("resize", update);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", update);
        };
    }, [ref]);

    return height;
}