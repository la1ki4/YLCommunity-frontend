import {useEffect} from "react";

import eventsPageStyle from "@app/styles/events.module.css";
import calendarInfoPopupStyle from "@app/styles/popup.module.css";

export function useRemoveEventPopupOnScrollAndClick({
                                                        dayBodyRef,
                                                        closePopup,
                                                    }) {
    useEffect(() => {
        const node = dayBodyRef.current;

        if (!node) {
            return;
        }

        const handleScroll = () => {
            closePopup();
        };

        const handleClick = (e) => {
            const isEvent = e.target.closest(
                `.${eventsPageStyle.dayEvent}`
            );

            const isPopup = e.target.closest(
                `.${calendarInfoPopupStyle.calendarInfoPopup}`
            );

            if (!isEvent && !isPopup) {
                closePopup();
            }
        };

        node.addEventListener(
            "scroll",
            handleScroll
        );

        node.addEventListener(
            "click",
            handleClick
        );

        return () => {
            node.removeEventListener(
                "scroll",
                handleScroll
            );

            node.removeEventListener(
                "click",
                handleClick
            );
        };
    }, [
        dayBodyRef,
        closePopup,
    ]);
}