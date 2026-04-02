import {useCallback, useMemo, useState} from "react";

const MIDDAY_MINUTES = 12 * 60;

function toDate(value) {
    return value instanceof Date ? value : new Date(value);
}

function resolvePlacement(start, end) {
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();

    if (startMinutes < MIDDAY_MINUTES && endMinutes > MIDDAY_MINUTES) {
        return "middle";
    }

    if (startMinutes < MIDDAY_MINUTES) {
        return "below";
    }

    return "above";
}

export function useCalendarEventInfoPopup() {
    const [state, setState] = useState({
        isOpen: false,
        event: null,
        anchorTop: 0,
    });

    const openPopup = useCallback(({event, top, height, gridHeight}) => {
        const start = toDate(event.startDate);
        const end = toDate(event.endDate);

        const placement = resolvePlacement(start, end);

        let anchorTop = top;

        if (placement === "below") {
            anchorTop = top + height + 8;
        } else if (placement === "middle") {
            anchorTop = Math.max(0, gridHeight / 2);
        } else {
            anchorTop = Math.max(0, top - 8);
        }

        setState({
            isOpen: true,
            event: {
                ...event,
                start,
                end,
            },
            anchorTop,
        });
    }, []);

    const closePopup = useCallback(() => {
        setState((prev) => {
            if (!prev.isOpen) {
                return prev;
            }

            return {
                ...prev,
                isOpen: false,
                event: null,
            };
        });
    }, []);

    const popupPosition = useMemo(() => {
        if (!state.event) {
            return {placement: "below", top: 0};
        }

        return {
            placement: resolvePlacement(state.event.start, state.event.end),
            top: state.anchorTop,
        };
    }, [state.anchorTop, state.event]);

    return {
        isPopupOpen: state.isOpen,
        selectedEvent: state.event,
        popupPosition,
        openPopup,
        closePopup,
    };
}
