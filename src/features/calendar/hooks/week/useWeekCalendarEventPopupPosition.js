import {useLayoutEffect} from "react";
import {getMondayBasedDayIndex} from "@features/calendar/utils/calendarDate.utils.js";

export function useLeftPosition({
                                    selectedEvent,
                                    popupTop,

                                    weekCalendarRef,
                                    selectedEventNodeRef,
                                    selectedLongEventRef,
                                    popupRef,

                                    setPopupLeft,
                                }) {
    useLayoutEffect(() => {
        const calendarNode = weekCalendarRef.current;
        const eventNode =
            selectedEventNodeRef.current ||
            selectedLongEventRef.current;
        const popupNode = popupRef.current;

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

        const popupWidth =
            popupNode.offsetWidth;

        let gap = 4;

        const start = new Date(
            selectedEvent.startDate
        );

        const dayIndex =
            getMondayBasedDayIndex(start);

        let leftDistanceForPopup = 800;
        let leftDistanceForMonday = 800;

        if (
            window.innerWidth <= 1150 &&
            window.innerWidth > 1100
        ) {
            leftDistanceForMonday = 750;
        }

        if (window.innerWidth <= 1100) {
            leftDistanceForMonday = 480;
            leftDistanceForPopup = 480;
            gap = 0;
        }

        let nextLeft;

        if (
            eventNode ===
            selectedLongEventRef.current
        ) {
            nextLeft =
                leftDistanceForPopup +
                gap +
                (
                    weekCalendarRef.current.offsetWidth -
                    popupWidth
                ) /
                2;
        } else if (dayIndex === 0) {
            nextLeft =
                eventRect.right -
                calendarRect.left +
                gap +
                leftDistanceForMonday;
        } else if (dayIndex > 0) {
            nextLeft =
                eventRect.left -
                calendarRect.left -
                popupWidth -
                gap +
                leftDistanceForPopup;
        }

        setPopupLeft(nextLeft);
    }, [
        selectedEvent,
        popupTop,

        weekCalendarRef,
        selectedEventNodeRef,
        selectedLongEventRef,
        popupRef,

        setPopupLeft,
    ]);
}


export function useTopPosition({
                                   selectedEvent,

                                   calendarHeaderRef,
                                   weekBodyRef,

                                   selectedEventNodeRef,
                                   selectedLongEventRef,
                                   popupRef,

                                   setPopupTop,
                               }) {
    useLayoutEffect(() => {
        const headerNode =
            calendarHeaderRef.current;

        const eventNode =
            selectedEventNodeRef.current ||
            selectedLongEventRef.current;

        const popupNode =
            popupRef.current;

        const container =
            weekBodyRef.current;

        if (
            !selectedEvent ||
            !headerNode ||
            !eventNode ||
            !popupNode ||
            !container
        ) {
            return;
        }

        const headerHeight =
            headerNode.offsetHeight;

        const eventHeight =
            eventNode.offsetHeight;

        const popupHeight =
            popupNode.offsetHeight;

        const popupHalfHeight =
            popupHeight / 2;

        const paddingTop = 35;

        const eventRect =
            eventNode.getBoundingClientRect();

        const containerRect =
            container.getBoundingClientRect();

        const distanceToEvent =
            eventRect.top -
            containerRect.top;

        let nextTop;

        if (window.innerHeight >= 645) {
            if (distanceToEvent > popupHeight) {
                nextTop =
                    headerHeight +
                    distanceToEvent -
                    popupHeight +
                    145;
            } else if (
                eventNode ===
                selectedLongEventRef.current
            ) {
                nextTop =
                    eventRect.top +
                    paddingTop;
            } else if (
                distanceToEvent < popupHeight &&
                distanceToEvent > 0
            ) {
                const progress =
                    distanceToEvent /
                    popupHeight;

                const topNearHeader =
                    headerHeight;

                const topNearEvent =
                    headerHeight +
                    distanceToEvent +
                    eventHeight / 2 -
                    popupHalfHeight;

                nextTop =
                    topNearHeader +
                    (
                        topNearEvent -
                        topNearHeader
                    ) *
                    progress;
            } else if (
                distanceToEvent < 0
            ) {
                nextTop =
                    headerHeight;
            }
        } else {
            nextTop =
                window.innerHeight / 2 -
                popupHeight / 2;
        }

        setPopupTop(nextTop);
    }, [
        selectedEvent,

        calendarHeaderRef,
        weekBodyRef,

        selectedEventNodeRef,
        selectedLongEventRef,
        popupRef,

        setPopupTop,
    ]);
}