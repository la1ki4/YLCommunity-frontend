import {useEffect} from "react";

import eventsPageStyle from "@app/styles/week-calendar.module.css";

export function useScrollWeekCalendarInside({
                                                weekBodyRef,
                                                mainRef,
                                                closePopup,
                                            }) {
    useEffect(() => {
        const node = weekBodyRef.current;
        const mainNode = mainRef?.current;

        if (!node) {
            return;
        }

        const handleInnerScroll = () => {
            closePopup();
        };

        const handlePageScroll = () => {
            closePopup();
        };

        const handleClick = (e) => {

            const isEvent = e.target.closest(
                `.${eventsPageStyle.weekEvent}`
            );

            if (!isEvent) {
                closePopup();
            }
        };

        node.addEventListener(
            "scroll",
            handleInnerScroll
        );

        node.addEventListener(
            "click",
            handleClick
        );

        if (mainNode) {
            mainNode.addEventListener(
                "scroll",
                handlePageScroll,
                {passive: true}
            );
        }

        return () => {
            node.removeEventListener(
                "scroll",
                handleInnerScroll
            );

            node.removeEventListener(
                "click",
                handleClick
            );

            if (mainNode) {
                mainNode.removeEventListener(
                    "scroll",
                    handlePageScroll
                );
            }
        };
    }, [
        weekBodyRef,
        mainRef,
        closePopup,
    ]);
}