import {useEffect, useMemo, useRef, useState} from "react";
import eventsPageStyle from "@app/styles/week-calendar.module.css";
import {Text} from "@shared/Text/Text.jsx";

import {NOW_TICK_MS} from "@features/calendar/constants/calendar.constants.js";
import {
    getMondayBasedDayIndex,
    isDateInWeek,
    getMonday, getSunday,
} from "@features/calendar/utils/calendarDate.utils.js";
import {DAY_COUNT_IN_WEEK} from "@features/calendar/constants/weekCalendar.constants.js";
import {buildHours, calcNowTopPx} from "@features/calendar/utils/weekCalendar.utils.js";
import {useElementHeight} from "@features/calendar/hooks/useElementHeight.js";
import {useNow} from "@features/calendar/hooks/useNow.js";
import WeekCalendarHeader from "@widgets/Calendars/WeekCalendar/components/WeekCalendarHeader.jsx";
import {useEventsBetweenDate} from "@features/get-calendar-events/get/getEventsBetweenDates.js";
import {getMinutesFromStartOfDay} from "@features/calendar/utils/dayCalendar.utils.js";
import {CalendarEvent} from "@widgets/Calendars/DayCalendar/components/CalendarEvent.jsx";
import {PX_PER_MINUTE} from "@features/calendar/constants/weekCalendar.constants.js";

export function WeekCalendarLayout(props) {

    const {date, selected, onAnchorDateChange} = props;

    const [currentDate, setCurrentDate] = useState(() => date ?? new Date());

    const [weekStart, setWeekStart] = useState(() =>
        getMonday(currentDate ?? new Date())
    );

    const monday = useMemo(
        () => getMonday(currentDate),
        [currentDate]
    );
    const sunday = useMemo(
        () => getSunday(currentDate),
        [currentDate]
    );

    const events = useEventsBetweenDate({
        startDate: monday,
        endDate: sunday
    });

    const now = useNow(NOW_TICK_MS);

    useEffect(() => {
        if (!date) return;
        setCurrentDate(date);
        setWeekStart(getMonday(date));
    }, [date]);


    const hours = useMemo(() => buildHours(), []);


    const today = useMemo(() => new Date(), []);
    const todayIndex = getMondayBasedDayIndex(today);

    const weekContainsToday = useMemo(() => isDateInWeek(today, weekStart), [today, weekStart]);

    const hLinesRef = useRef(null);
    const gridHeight = useElementHeight(hLinesRef);
    const nowTop = useMemo(() => calcNowTopPx(now, gridHeight), [now, gridHeight]);

    function formatDateKey(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    function groupEventsByDateMap(events) {
        const map = new Map();

        events.forEach(event => {
            const key = formatDateKey(event.startDate);

            if (!map.has(key)) {
                map.set(key, []);
            }

            map.get(key).push(event);
        });

        return map;
    }

    const result = groupEventsByDateMap(events);

    return (
        <section className={eventsPageStyle.weekCalendar}>
            <WeekCalendarHeader anchor={currentDate} selected={selected} onAnchorDateChange={onAnchorDateChange}
                                weekStart={weekStart}/>
            <div className={eventsPageStyle.weekBody}>
                <div className={eventsPageStyle.weekScroll}>
                    <div className={eventsPageStyle.weekTimes}>
                        {hours.map((h) => (
                            <div key={h} className={eventsPageStyle.weekTimeRow}>
                                <Text className={eventsPageStyle.weekTimeText} text={`${h}:00`}/>
                            </div>
                        ))}
                    </div>

                    <div className={eventsPageStyle.weekGrid}>
                        <div className={eventsPageStyle.weekGridInner}>
                            <div className={eventsPageStyle.weekVLines}>
                                {Array.from({length: DAY_COUNT_IN_WEEK}).map((_, i) => (
                                    <div key={i} className={eventsPageStyle.weekVLineCol}/>
                                ))}
                            </div>

                            <div className={eventsPageStyle.weekHLines} ref={hLinesRef}>
                                {hours.map((h) => (
                                    <div key={h} className={eventsPageStyle.weekHLineRow}/>
                                ))}
                            </div>

                            {Array.from(result.entries()).map(([date, events]) =>
                                events.map((event, index) => {
                                    const start = new Date(event.startDate);
                                    const end = new Date(event.endDate);

                                    const startMinutes = getMinutesFromStartOfDay(start);
                                    const durationMinutes = (end - start) / 1000 / 60;


                                    const top = startMinutes * PX_PER_MINUTE;
                                    const height = durationMinutes * PX_PER_MINUTE;

                                    const dayIndex = start.getDay();

                                    const overlap = 0 + index;

                                    const dayWidth = 100 / 7;
                                    const width = dayWidth / events.length;
                                    const left = (dayWidth * (dayIndex - 1)) + (width * index) - overlap;

                                    return (
                                        <CalendarEvent
                                            key={`${date}-${event.startDate}`}
                                            title={event.title}
                                            className={eventsPageStyle.weekEvent}
                                            style={{
                                                top: `${top}px`,
                                                height: `${height}px`,
                                                left: `${left}%`,
                                                width: `${width}%`,
                                            }}
                                        />
                                    );
                                })
                            )}



                            {weekContainsToday && (
                                <div
                                    className={eventsPageStyle.weekNowLine}
                                    style={{top: nowTop, ["--dayIndex"]: todayIndex}}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
