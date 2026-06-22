import {useLayoutEffect} from "react";

export function useMoreEventPopupPosition({
                                              calendarHeaderRef,
                                              moreEventPopupRef,
                                              cellRef,
                                              mainRef,

                                              cellRowIndex,
                                              cellColIndex,

                                              windowWidth,
                                              windowHeight,

                                              setMoreEventsPopupTop,
                                              setMoreEventsPopupLeft,
                                          }) {
    useLayoutEffect(() => {
        const calendarHeaderNode = calendarHeaderRef.current;
        const cellNode = cellRef.current;
        const mainNode = mainRef.current;
        const moreEventPopupNode = moreEventPopupRef.current;

        if (
            !calendarHeaderNode ||
            !cellNode ||
            !mainNode ||
            !moreEventPopupNode
        ) {
            return;
        }

        const calendarHeaderRect = calendarHeaderNode.getBoundingClientRect();
        const cellRect = cellNode.getBoundingClientRect();
        const mainRect = mainNode.getBoundingClientRect();
        const moreEventPopupRect = moreEventPopupNode.getBoundingClientRect();

        const topGap = 35;
        if( windowWidth <= 1100) {
            setMoreEventsPopupTop(windowHeight / 2 - moreEventPopupRect.height / 2);
            setMoreEventsPopupLeft(windowWidth / 2);
            return;
        }

        setMoreEventsPopupTop(
            cellRect.height * cellRowIndex +
            calendarHeaderRect.height +
            topGap
        );

        setMoreEventsPopupLeft(
            mainRect.width -
            calendarHeaderRect.width +
            185 +
            cellRect.width * cellColIndex
        );
    }, [cellRowIndex, cellColIndex, windowWidth, windowHeight, calendarHeaderRef, cellRef, mainRef, setMoreEventsPopupTop, setMoreEventsPopupLeft, moreEventPopupRef]);
}