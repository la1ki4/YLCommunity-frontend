import {useLayoutEffect} from "react";

export function useCalculateEventPopupPositionForMonthCalendar({
                                                                   selectedEvent,
                                                                   isPopupVisible,
                                                                   popupPositionVersion,

                                                                   popupRef,

                                                                   calendarHeaderRef,
                                                                   calendarSectionRef,
                                                                   moreEventPopupRef,
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
        const calendarHeaderNode = calendarHeaderRef.current;
        const eventNode = selectedEventRef.current;
        const popupNode = popupRef.current;
        const calendarSectionNode = calendarSectionRef.current;
        const calendarRowNode = calendarRowRef.current;
        const calendarCellNode = cellRef.current;
        const moreEventPopupNode = moreEventPopupRef?.current;

        if (
            !selectedEvent ||
            !calendarHeaderNode ||
            !eventNode ||
            !popupNode
        ) {
            return;
        }


        const calendarHeaderRect = calendarHeaderNode.getBoundingClientRect();
        const eventRect = eventNode.getBoundingClientRect();
        const popupRect = popupNode.getBoundingClientRect();
        const calendarSectionRect = calendarSectionNode.getBoundingClientRect();
        const calendarRowRect = calendarRowNode.getBoundingClientRect();
        const calendarCellRect = calendarCellNode.getBoundingClientRect();
        const moreEventPopupRect = moreEventPopupNode?.getBoundingClientRect();

        const rowIndex =
            selectedRowIndexRef.current;

        const colIndex =
            selectedColIndexRef.current;

        setPopupLeft(
            calculatePopupLeft({
                calendarHeaderRect,
                eventRect,
                popupRect,
                calendarSectionRect,
                calendarCellRect,
                colIndex,
                moreEventPopupRect,
            })
        );

        setPopupTop(
            calculatePopupTop({
                calendarHeaderRect,
                eventRect,
                popupRect,
                calendarSectionRect,
                calendarRowRect,
                moreEventPopupRect,
                rowIndex,
            })
        );
    }, [selectedEvent, isPopupVisible, popupPositionVersion, popupRef, calendarHeaderRef, calendarSectionRef, calendarRowRef, cellRef, selectedEventRef, selectedRowIndexRef, selectedColIndexRef, calculatePopupLeft, calculatePopupTop, setPopupLeft, setPopupTop, moreEventPopupRef]);
}