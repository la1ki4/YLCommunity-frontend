import {useEffect} from "react";

export function useCalculateMonthEventSize({
                                               cellHeight,
                                               dayNumberRef,
                                               measureButtonRef,
                                               setElementSizes,
                                           }) {
    useEffect(() => {
        const dayNumberHeight =
            dayNumberRef.current?.getBoundingClientRect().height || 0;

        const buttonHeight =
            measureButtonRef.current?.getBoundingClientRect().height || 0;

        setElementSizes({
            dayNumberHeight,
            buttonHeight,
        });
    }, [
        cellHeight,
        dayNumberRef,
        measureButtonRef,
        setElementSizes,
    ]);
}