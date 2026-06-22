import {useCallback, useEffect, useLayoutEffect} from "react";

import {getDayOfWeekShort} from "@features/calendar/utils/calendarDate.utils.js";
import {DOW} from "@features/calendar/constants/calendar.constants";

export function useMoreEventsPopupPosition({
                                               view,
                                               scrollRef,
                                               dayButtonRefs,
                                               morePopupRef,
                                               calendarContainerRef,
                                               yearMiniCalendarRef,
                                               monthCalendarPositionIndex,
                                               setMonthCalendarPositionIndex,
                                               setMoreInfoPopupTop,
                                               setMoreInfoPopupLeft,
                                           }) {

    const updatePosition = useCallback(() => {
        if (!view) {
            return;
        }

        const key =
            `${view.year}-${view.monthIndex}-${view.day}`;

        const button =
            dayButtonRefs.current[key];

        const yearMiniCalendarNode =
            yearMiniCalendarRef.current;

        const morePopupNode = morePopupRef.current;

        const calendarSectionNode = calendarContainerRef.current;

        const dow = getDayOfWeekShort(view);
        const dowIndex = DOW.indexOf(dow);

        if (
            !button ||
            !yearMiniCalendarNode ||
            !morePopupNode ||
            !calendarSectionNode
        ) {
            return;
        }

        let positionIndex;

        switch (true) {
            case window.innerWidth > 1700:
                positionIndex = view.monthIndex % 4;
                break;

            case window.innerWidth > 1500:
                positionIndex = view.monthIndex % 3;
                break;

            case window.innerWidth > 900:
                positionIndex = view.monthIndex % 2;
                break;

            default:
                positionIndex = 0;
        }

        if (
            positionIndex !==
            monthCalendarPositionIndex
        ) {
            setMonthCalendarPositionIndex(
                positionIndex
            );
        }

        const buttonRect =
            button.getBoundingClientRect();

        const yearMiniCalendarRect =
            yearMiniCalendarNode.getBoundingClientRect();

        const morePopupRect = morePopupNode.getBoundingClientRect();
        const calendarSectionRect = calendarSectionNode.getBoundingClientRect();

        const yearCalendarPos =
            (yearMiniCalendarRect.width + 18) *
            positionIndex;

        const yearWeekCalendarButtonPos =
            (yearMiniCalendarRect.width / 7) *
            dowIndex;

        if (window.innerWidth > 900) {
            setMoreInfoPopupTop(
                buttonRect.top - buttonRect.height
            );

            setMoreInfoPopupLeft(
                -200 +
                40 +
                yearCalendarPos +
                yearWeekCalendarButtonPos
            );
        } else {
            setMoreInfoPopupTop(window.innerHeight / 2)
            setMoreInfoPopupLeft(window.innerWidth / 2 - morePopupRect.width / 2 - calendarSectionRect.width / 2 + 110);
        }
    }, [view, dayButtonRefs, yearMiniCalendarRef, morePopupRef, calendarContainerRef, monthCalendarPositionIndex, setMonthCalendarPositionIndex, setMoreInfoPopupTop, setMoreInfoPopupLeft]);

    useLayoutEffect(() => {
        updatePosition();
    }, [updatePosition]);

    useEffect(() => {
        const node = scrollRef.current;

        if (!node) {
            return;
        }

        node.addEventListener(
            "scroll",
            updatePosition,
            {passive: true}
        );

        return () => {
            node.removeEventListener(
                "scroll",
                updatePosition
            );
        };
    }, [scrollRef, updatePosition]);
}