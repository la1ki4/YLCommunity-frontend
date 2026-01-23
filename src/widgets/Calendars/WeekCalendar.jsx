import { useEffect, useMemo, useRef, useState } from "react";
import eventsPageStyle from "@app/styles/week-calendar.module.css";
import { Button } from "@shared/Button/Button.jsx";
import { Text } from "@shared/Text/Text.jsx";
import { Media } from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";

import {DOW, MONTH_NAMES, NOW_TICK_MS} from "@features/calendar/constants/calendar.constants";
import {
    getMondayBasedDayIndex,
    isDateInWeek,
    startOfWeekMonday,
} from "@features/calendar/utils/calendarDate.utils";

import { DAY_COUNT_IN_WEEK } from "@features/calendar/constants/weekCalendar.constants";
import { buildHours, calcNowTopPx } from "@features/calendar/utils/weekCalendar.utils";
import { useElementHeight } from "@features/calendar/hooks/useElementHeight.js";
import { useNow } from "@features/calendar/hooks/useNow.js";
import { useWeekDays } from "@features/calendar/hooks/useWeekDays.js";
import { createNavCalendar } from "@features/calendar/utils/navCalendar";

export function WeekCalendarLayout({ anchorDate, selected, onAnchorDateChange }) {

    const [anchor, setAnchor] = useState(() => anchorDate ?? new Date());
    const [weekStart, setWeekStart] = useState(() =>
        startOfWeekMonday(anchorDate ?? new Date())
    );

    const now = useNow(NOW_TICK_MS);

    useEffect(() => {
        if (!anchorDate) return;
        setAnchor(anchorDate);
        setWeekStart(startOfWeekMonday(anchorDate));
    }, [anchorDate]);

    const navCalendar = useMemo(
        () =>
            createNavCalendar({
                setAnchor,
                setWeekStart,
                onAnchorDateChange,
            }),
        [setAnchor, setWeekStart, onAnchorDateChange]
    );

    const headerMonth = MONTH_NAMES[anchor.getMonth()];
    const headerYear = String(anchor.getFullYear());

    const hours = useMemo(() => buildHours(), []);


    const days = useWeekDays({
        weekStart,
        selected,
        dowLabels: DOW,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const today = new Date();
    const todayIndex = getMondayBasedDayIndex(today);

    const weekContainsToday = useMemo(() => isDateInWeek(today, weekStart), [today, weekStart]);


    const hLinesRef = useRef(null);
    const gridHeight = useElementHeight(hLinesRef);

    const nowTop = useMemo(() => calcNowTopPx(now, gridHeight), [now, gridHeight]);

    return (
        <section className={eventsPageStyle.weekCalendar}>
            <div className={eventsPageStyle.weekHeader}>
                <div className={eventsPageStyle.weekHeaderLeft}>
                    <Text className={eventsPageStyle.weekMonth} text={headerMonth} />
                    <Text className={eventsPageStyle.weekYear} text={headerYear} />

                    <div className={eventsPageStyle.weekNav}>
                        <Button className={eventsPageStyle.weekNavBtn} onClick={() => navCalendar(7, "prev")}>
                            <Media image={leftIcon} />
                        </Button>
                        <Button className={eventsPageStyle.weekNavBtn} onClick={() => navCalendar(7, "next")}>
                            <Media image={rightIcon} />
                        </Button>
                    </div>
                </div>

                <div className={eventsPageStyle.weekHeaderDays}>
                    {days.map((d) => (
                        <div key={d.dateObj.toISOString()} className={eventsPageStyle.weekHeaderDay}>
                            <Text className={eventsPageStyle.weekDayName} text={d.label} />
                            <div
                                className={[
                                    eventsPageStyle.weekDayNumber,
                                    d.selected ? eventsPageStyle.weekDayNumberSelected : "",
                                ].join(" ")}
                            >
                                <Text className={eventsPageStyle.weekDayNumberText} text={String(d.date)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={eventsPageStyle.weekBody}>
                <div className={eventsPageStyle.weekScroll}>
                    <div className={eventsPageStyle.weekTimes}>
                        {hours.map((h) => (
                            <div key={h} className={eventsPageStyle.weekTimeRow}>
                                <Text className={eventsPageStyle.weekTimeText} text={`${h}:00`} />
                            </div>
                        ))}
                    </div>

                    <div className={eventsPageStyle.weekGrid}>
                        <div className={eventsPageStyle.weekGridInner}>
                            <div className={eventsPageStyle.weekVLines}>
                                {Array.from({ length: DAY_COUNT_IN_WEEK }).map((_, i) => (
                                    <div key={i} className={eventsPageStyle.weekVLineCol} />
                                ))}
                            </div>

                            <div className={eventsPageStyle.weekHLines} ref={hLinesRef}>
                                {hours.map((h) => (
                                    <div key={h} className={eventsPageStyle.weekHLineRow} />
                                ))}
                            </div>

                            {weekContainsToday && (
                                <div
                                    className={eventsPageStyle.weekNowLine}
                                    style={{ top: nowTop, ["--dayIndex"]: todayIndex }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
