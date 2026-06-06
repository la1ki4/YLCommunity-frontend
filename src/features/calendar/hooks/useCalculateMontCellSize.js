import {useEffect} from "react";

export function useCalculateMonthCellSize({
                                              cellRef,
                                              setCellSize,
                                          }) {
    useEffect(() => {
        if (!cellRef.current) {
            return;
        }

        const observer = new ResizeObserver(
            ([entry]) => {
                const borderSize =
                    entry.borderBoxSize?.[0];

                const width =
                    borderSize?.inlineSize ??
                    entry.contentRect.width;

                const height =
                    borderSize?.blockSize ??
                    entry.contentRect.height;

                setCellSize((prev) => {
                    if (
                        Math.abs(prev.width - width) < 1 &&
                        Math.abs(prev.height - height) < 1
                    ) {
                        return prev;
                    }

                    return {
                        width,
                        height,
                    };
                });
            }
        );

        observer.observe(cellRef.current);

        return () => {
            observer.disconnect();
        };
    }, [cellRef, setCellSize]);
}