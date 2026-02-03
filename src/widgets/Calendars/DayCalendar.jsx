import {useMemo, useRef} from "react";
import eventsPageStyle from "@app/styles/events.module.css";
import {Button} from "@shared/Button/Button.jsx";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";

import {DOW, MONTH_NAMES, NOW_TICK_MS} from "@features/calendar/constants/calendar.constants";
import {useElementHeight} from "@features/calendar/hooks/useElementHeight";
import {useNow} from "@features/calendar/hooks/useNow";
import {createNavCalendar} from "@features/calendar/utils/navCalendar";
import {isSameDay} from "@features/calendar/utils/dateMatch.utils.js";

export function DayCalendar({date, onChangeDate}) {

    const viewDate = useMemo(() => {
        return date ?? new Date();
    }, [date]);

    const hours = useMemo(
        () => Array.from({length: 23}, (_, i) => `${i + 1}:00`),
        []
    );

    const gridRef = useRef(null);
    const gridHeight = useElementHeight(gridRef);

    const navCalendar = useMemo(
        () =>
            createNavCalendar({
                setAnchor: (updater) => {
                    const next =
                        typeof updater === "function" ? updater(viewDate) : updater;

                    onChangeDate?.(next);
                },
                setWeekStart: () => {
                },
                onAnchorDateChange: onChangeDate,
            }),
        [viewDate, onChangeDate]
    );
    const now = useNow(NOW_TICK_MS);
    const minutesFromStartOfDay =
        now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    const nowTop =
        gridHeight > 0 ? (minutesFromStartOfDay / (24 * 60)) * gridHeight : 0;
    const showNowLine = isSameDay(viewDate, now);
    const dowIndex = (viewDate.getDay() + 6) % 7;
    const dowText = DOW[dowIndex];
    const dayNum = viewDate.getDate();
    const monthText = MONTH_NAMES[viewDate.getMonth()];
    const yearText = viewDate.getFullYear();

    return (
        <section className={eventsPageStyle.day} aria-label="Day calendar">
            <header className={eventsPageStyle.dayHeader}>
                <div className={eventsPageStyle.dayLeft}>
                    <div className={eventsPageStyle.badge}>
                        <div>
                            <div className={eventsPageStyle.dow}>{dowText}</div>
                            <div className={eventsPageStyle.pill}>{dayNum}</div>
                        </div>
                    </div>
                </div>

                <div className={eventsPageStyle.dayTitle}>
                    {monthText} {dayNum}, {yearText}
                </div>

                <div className={eventsPageStyle.dayRight} aria-label="Navigation">
                    <Button
                        className={eventsPageStyle.navBtn}
                        onClick={() => navCalendar(1, "prev")}
                    >
                        <Media image={leftIcon}/>
                    </Button>
                    <Button
                        className={eventsPageStyle.navBtn}
                        onClick={() => navCalendar(1, "next")}
                    >
                        <Media image={rightIcon}/>
                    </Button>
                </div>
            </header>

            <div className={eventsPageStyle.dayBody}>
                <div className={eventsPageStyle.timeline}>
                    <div className={eventsPageStyle.timeCol} aria-hidden="true">
                        {hours.map((time) => (
                            <div key={time} className={eventsPageStyle.time}>
                                {time}
                            </div>
                        ))}
                    </div>

                    <div className={eventsPageStyle.gridCol} ref={gridRef}>
                        {Array.from({length: 24}).map((_, i) => (
                            <div key={i} className={eventsPageStyle.row}/>
                        ))}

                        {showNowLine && (
                            <div
                                className={eventsPageStyle.now}
                                title="Now"
                                style={{top: nowTop}}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
