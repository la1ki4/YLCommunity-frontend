import {useLayoutEffect} from "react";

export function useCalculateEventPopupPositionForMonthCalendar({
                                                                selectedEvent,
                                                                isPopupVisible,
                                                                popupPositionVersion,

                                                                popupRef,

                                                                calendarHeaderRef,
                                                                calendarSectionRef,
                                                                calendarRowRef,
                                                                cellRef,

                                                                selectedEventRef,
                                                                selectedRowIndexRef,
                                                                selectedColIndexRef,

                                                                calculatePopupLeft,
                                                                calculatePopupTop,

                                                                setPopupLeft,
                                                                setPopupTop,
                                                            }) {
    useLayoutEffect(() => {
        const calendarNode = calendarHeaderRef.current;
        const eventNode = selectedEventRef.current;
        const popupNode = popupRef.current;
        const calendarHeaderNode = calendarHeaderRef.current;
        const calendarSectionNode = calendarSectionRef.current;
        const calendarRowNode = calendarRowRef.current;
        const calendarCellNode = cellRef.current;

        if (
            !selectedEvent ||
            !calendarNode ||
            !eventNode ||
            !popupNode
        ) {
            return;
        }

        const calendarRect =
            calendarNode.getBoundingClientRect();

        const eventRect =
            eventNode.getBoundingClientRect();

        const popupRect =
            popupNode.getBoundingClientRect();

        const calendarHeaderRect =
            calendarHeaderNode.getBoundingClientRect();

        const calendarSectionRect =
            calendarSectionNode.getBoundingClientRect();

        const calendarRowRect =
            calendarRowNode.getBoundingClientRect();

        const calendarCellRect =
            calendarCellNode.getBoundingClientRect();

        const rowIndex =
            selectedRowIndexRef.current;

        const colIndex =
            selectedColIndexRef.current;

        setPopupLeft(
            calculatePopupLeft({
                calendarRect,
                eventRect,
                popupRect,
                calendarSectionRect,
                calendarCellRect,
                colIndex,
            })
        );

        setPopupTop(
            calculatePopupTop({
                calendarRect,
                eventRect,
                popupRect,
                calendarHeaderRect,
                calendarSectionRect,
                calendarRowRect,
                rowIndex,
            })
        );
    }, [
        selectedEvent,
        isPopupVisible,
        popupPositionVersion,

        popupRef,

        calendarHeaderRef,
        calendarSectionRef,
        calendarRowRef,
        cellRef,

        selectedEventRef,
        selectedRowIndexRef,
        selectedColIndexRef,

        calculatePopupLeft,
        calculatePopupTop,

        setPopupLeft,
        setPopupTop,
    ]);
}