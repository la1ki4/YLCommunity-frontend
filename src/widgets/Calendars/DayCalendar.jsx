import {useMemo, useRef} from "react";
import eventsPageStyle from "@app/styles/events.module.css";
import {Button} from "@shared/Button/Button.jsx";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";

import {DOW, MONTH_NAMES, NOW_TICK_MS} from "@features/calendar/constants/calendar.constants";
import {isSameYMD} from "@features/calendar/utils/calendarDate.utils";
import {useElementHeight} from "@features/calendar/hooks/useElementHeight";
import {useNow} from "@features/calendar/hooks/useNow";
import {createNavCalendar} from "@features/calendar/utils/navCalendar";

export function DayCalendar({ date, onChangeDate }) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const viewDate = date ?? new Date();

    const hours = useMemo(
        () => Array.from({ length: 23 }, (_, i) => `${i + 1}:00`),
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
                setWeekStart: () => {},
                onAnchorDateChange: onChangeDate,
            }),
        [viewDate, onChangeDate]
    );
    const now = useNow(NOW_TICK_MS);
    const minutesFromStartOfDay =
        now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    const nowTop =
        gridHeight > 0 ? (minutesFromStartOfDay / (24 * 60)) * gridHeight : 0;
    const showNowLine = isSameYMD(viewDate, now);
    const dowText = DOW[viewDate.getDay()];
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
                        <Media image={leftIcon} />
                    </Button>
                    <Button
                        className={eventsPageStyle.navBtn}
                        onClick={() => navCalendar(1, "next")}
                    >
                        <Media image={rightIcon} />
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
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div key={i} className={eventsPageStyle.row} />
                        ))}

                        {showNowLine && (
                            <div
                                className={eventsPageStyle.now}
                                title="Now"
                                style={{ top: nowTop }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
