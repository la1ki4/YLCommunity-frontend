import {useEffect} from "react";

export function getCountryAndCityFromFormat(countryAndCityFormat) {
    if (typeof countryAndCityFormat !== "string") {
        return {
            country: "",
            city: "",
        };
    }

    const [country = "", ...cityParts] = countryAndCityFormat.split(",");

    return {
        country: country.trim(),
        city: cityParts.join(",").trim(),
    };
}


export function useOutsideClick({
                                    ref,
                                    ignoreRefs = [],
                                    isEnabled,
                                    onOutsideClick,
                                }) {
    useEffect(() => {
        if (!isEnabled) {
            return;
        }

        console.log(ignoreRefs);

        const containsTarget = (
            ignoreItem,
            target
        ) => {
            if (!ignoreItem) {
                return false;
            }

            if (Array.isArray(ignoreItem)) {
                return ignoreItem.some((item) =>
                    containsTarget(item, target)
                );
            }

            const current = ignoreItem.current;

            if (!current) {
                return false;
            }

            if (current instanceof HTMLElement) {
                return current.contains(target);
            }

            return Object.values(current).some(
                (element) =>
                    element instanceof HTMLElement &&
                    element.contains(target)
            );
        };

        const handleClickOutside = (event) => {
            if (!ref?.current) {
                return;
            }

            const clickedInsidePopup =
                ref.current.contains(event.target);

            const clickedInsideIgnored =
                containsTarget(
                    ignoreRefs,
                    event.target
                );

            if (
                !clickedInsidePopup &&
                !clickedInsideIgnored
            ) {
                onOutsideClick();
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [
        ref,
        ignoreRefs,
        isEnabled,
        onOutsideClick,
    ]);
}

export function createEventPopupMonthHandler({
                                                 setIsPopupVisible,
                                                 setSelectedEvent,
                                                 setPopupPositionVersion,

                                                 selectedEventRef,
                                                 selectedRowIndexRef,
                                                 selectedColIndexRef,
                                             }) {
    const closePopup = () => {
        setIsPopupVisible(false);

        selectedEventRef.current = null;

        setTimeout(() => {
            setSelectedEvent(null);
        }, 220);
    };

    const openPopup = (
        event,
        element,
        rowIndex = null,
        colIndex = null,
    ) => {
        selectedEventRef.current = element;
        selectedRowIndexRef.current = rowIndex;
        selectedColIndexRef.current = colIndex;

        setSelectedEvent(event);

        setPopupPositionVersion((prev) => prev + 1);

        requestAnimationFrame(() => {
            setIsPopupVisible(true);
        });
    };

    return {
        openPopup,
        closePopup,
    };
}

export function createEventPopupHandlers({
                                             setIsPopupVisible,
                                             setSelectedEvent,
                                         }) {
    const closePopup = () => {
        setIsPopupVisible(false);

        setTimeout(() => {
            setSelectedEvent(null);
        }, 220);
    };

    const openPopup = (
        event,
    ) => {
        setSelectedEvent(event);
        requestAnimationFrame(() => {
            setIsPopupVisible(true);
        });
    };

    return {
        openPopup,
        closePopup,
    };
}


