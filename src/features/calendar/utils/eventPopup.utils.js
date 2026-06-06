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

        const handleClickOutside = (event) => {
            const clickedInsidePopup =
                ref.current?.contains(event.target);

            const clickedInsideIgnored = ignoreRefs.some((ignoreRef) => {
                const current = ignoreRef.current;

                if (!current) {
                    return false;
                }

                if (current instanceof HTMLElement) {
                    return current.contains(event.target);
                }

                return Object.values(current).some(
                    (element) => {
                        return (
                            element instanceof HTMLElement &&
                            element.contains(event.target))
                    }
                );
            });

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

export function createEventPopupHandlers({
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


