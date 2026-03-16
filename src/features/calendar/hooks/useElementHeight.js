import { useLayoutEffect, useState } from "react";

export function useElementHeight(ref) {
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        if (!ref.current) return;

        const update = () => {
            setHeight(ref.current.offsetHeight);
        };

        update();

        const observer = new ResizeObserver(update);
        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [ref]);

    return height;
}
