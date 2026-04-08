import { forwardRef } from "react";
import {DOW} from "@features/calendar/constants/calendar.constants.js";
import eventsPageStyle from "@app/styles/events.module.css";
import {formatDayTitle} from "@features/calendar/utils/dayCalendar.utils.js";
import {Button} from "@shared/Button/Button.jsx";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";
import {useMemo} from "react";
import {createNavCalendar} from "@features/calendar/utils/navCalendar.js";
import {isSameDay} from "@features/calendar/utils/dateMatch.utils.js";
import {useNow} from "@features/calendar/hooks/useNow.js";
import {MINICALENDAR_TICK_MS} from "@features/calendar/constants/miniCalendar.constants.js";

export const DayCalendarHeader = forwardRef(function DayCalendarHeader({ viewDate, onChangeDate, onSelect}, ref){
    const dowIndex = (viewDate.getDay() + 6) % 7;
    const dowText = DOW[dowIndex];
    const day = viewDate.getDate();
    const today = useNow(MINICALENDAR_TICK_MS);
    const isToday = isSameDay(viewDate,today);

    const navCalendar = useMemo(
        () =>
            createNavCalendar({
                setAnchor: (updater) => {
                    const next =
                        typeof updater === "function" ? updater(viewDate) : updater;

                    onChangeDate?.(next);
                    onSelect?.({
                        day: next.getDate(),
                        monthIndex: next.getMonth(),
                        year: next.getFullYear(),
                    });
                },
                setWeekStart: () => {},
                onAnchorDateChange: onChangeDate,
            }),
        [viewDate, onChangeDate, onSelect]
    );

    return (
        <header className={eventsPageStyle.dayHeader} ref={ref}>
            <div className={eventsPageStyle.dayLeft}>
                <div className={eventsPageStyle.badge}>
                    <div>
                        <div className={eventsPageStyle.dow}>{dowText}</div>
                        <div className={[
                            isToday && eventsPageStyle.todayPill,
                            eventsPageStyle.pill
                        ].filter(Boolean).join(" ")}>{day}</div>
                    </div>
                </div>
            </div>

            <div className={eventsPageStyle.dayTitle}>
                {formatDayTitle(viewDate)}
            </div>

            <div className={eventsPageStyle.dayRight} aria-label="Navigation">
                <Button
                    className={eventsPageStyle.navBtn}
                    onClick={() =>
                    {
                        navCalendar(1, "prev")
                    }}
                >
                    <Media image={leftIcon}/>
                </Button>
                <Button
                    className={eventsPageStyle.navBtn}
                    onClick={() =>
                    {
                        navCalendar(1, "next")
                    }}
                >
                    <Media image={rightIcon}/>
                </Button>
            </div>
        </header>
    );
})
