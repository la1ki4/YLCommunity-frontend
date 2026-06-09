import {useEffect} from "react";

export function useSetLongEventTopPopupPosition({
                                           selectedEvent,
                                           longEventsLength,

                                           selectedLongEventNodeRef,
                                           popupRef,
                                           dayBodyRef,

                                           setPopupTop,
                                       }) {
    useEffect(() => {
        const buttonNode =
            selectedLongEventNodeRef.current;

        const popupNode =
            popupRef.current;

        const rootNode =
            dayBodyRef.current?.parentElement;

        if (
            !selectedEvent ||
            !buttonNode ||
            !popupNode ||
            !rootNode
        ) {
            return;
        }

        const buttonRect =
            buttonNode.getBoundingClientRect();

        const rootRect =
            rootNode.getBoundingClientRect();

        const nextTop =
            buttonRect.bottom -
            rootRect.top;

        setPopupTop(nextTop);
    }, [
        selectedEvent,
        longEventsLength,

        selectedLongEventNodeRef,
        popupRef,
        dayBodyRef,

        setPopupTop,
    ]);
}

export function useSetDefaultEventTopPopupPosition({
                                                       selectedEvent,
                                                       sortedEvents,
                                                       longEventsLength,

                                                       dayBodyRef,
                                                       selectedEventNodeRef,
                                                       popupRef,
                                                       headerRef,
                                                       longEventRef,

                                                       setPopupTop,
                                                   }) {
    useEffect(() => {
        const container =
            dayBodyRef.current;

        const eventNode =
            selectedEventNodeRef.current;

        const popupNode =
            popupRef.current;

        const headerNode =
            headerRef.current;

        const longEventNode =
            longEventRef.current;

        if (
            !selectedEvent ||
            !container ||
            !eventNode ||
            !popupNode ||
            !headerNode
        ) {
            return;
        }

        const visibleTop =
            eventNode.offsetTop -
            container.scrollTop;

        const popupHeight =
            popupNode.offsetHeight;

        const headerHeight =
            headerNode.offsetHeight;

        const longEventBlockHeight =
            longEventNode?.offsetHeight ?? 0;

        const eventHeight =
            eventNode.offsetHeight;

        const containerHeight =
            container.clientHeight;

        const eventVisibleBottom =
            visibleTop + eventHeight;

        const topBase =
            headerHeight +
            longEventBlockHeight;

        const spaceAbove =
            visibleTop;

        const spaceBelow =
            containerHeight -
            eventVisibleBottom;

        let nextTop;

        if (spaceAbove >= popupHeight) {
            nextTop =
                topBase +
                visibleTop -
                popupHeight;
        } else if (
            spaceBelow >= popupHeight
        ) {
            nextTop =
                topBase +
                visibleTop +
                eventHeight;
        } else {
            nextTop = 0;
        }

        setPopupTop(nextTop);
    }, [
        selectedEvent,
        sortedEvents,
        longEventsLength,

        dayBodyRef,
        selectedEventNodeRef,
        popupRef,
        headerRef,
        longEventRef,

        setPopupTop,
    ]);
}