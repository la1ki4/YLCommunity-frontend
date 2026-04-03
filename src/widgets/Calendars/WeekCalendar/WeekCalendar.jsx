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
import {useEventsBetweenDates} from "@features/get-calendar-events/hooks/useEventsBetweenDates.js";
import {useDivideCalendarEvents} from "@features/get-calendar-events/hooks/useDivideCalendarEvents.js";
import {getMinutesFromStartOfDay} from "@features/calendar/utils/dayCalendar.utils.js";
import {CalendarEvent} from "@widgets/Calendars/DayCalendar/components/CalendarEvent.jsx";
import {PX_PER_MINUTE} from "@features/calendar/constants/weekCalendar.constants.js";
import {CalendarInfoPopup} from "@widgets/Calendars/CalendarInfoPopup/CalendarInfoPopup.jsx";
import {useCalendarEventInfoPopup} from "@features/get-calendar-events/hooks/useCalendarEventInfoPopup.js";

const DAY_MS = 24 * 60 * 60 * 1000;

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

    const events = useEventsBetweenDates({
        startDate: monday,
        endDate: sunday
    });
    const {timelineEvents, longEvents} = useDivideCalendarEvents({
        events,
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
    const {
        isPopupOpen,
        selectedEvent,
        popupPosition,
        openPopup,
        closePopup,
    } = useCalendarEventInfoPopup();

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

    const result = groupEventsByDateMap(timelineEvents);

    const longEventSegments = useMemo(() => {
        const mondayStart = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate());
        const sundayStart = new Date(mondayStart.getTime() + (DAY_COUNT_IN_WEEK - 1) * DAY_MS);
        const weekEndExclusive = new Date(mondayStart.getTime() + DAY_COUNT_IN_WEEK * DAY_MS);

        const segments = longEvents
            .map((event) => {
                if (event.end <= mondayStart || event.start >= weekEndExclusive) {
                    return null;
                }

                const firstDayStart = new Date(Math.max(
                    new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate()).getTime(),
                    mondayStart.getTime()
                ));

                const lastIncludedMoment = new Date(event.end.getTime() - 1);

                if (lastIncludedMoment < mondayStart) {
                    return null;
                }

                const lastDayStart = new Date(Math.min(
                    new Date(lastIncludedMoment.getFullYear(), lastIncludedMoment.getMonth(), lastIncludedMoment.getDate()).getTime(),
                    sundayStart.getTime()
                ));

                const startDayIndex = Math.floor((firstDayStart.getTime() - mondayStart.getTime()) / DAY_MS);
                const endDayIndex = Math.floor((lastDayStart.getTime() - mondayStart.getTime()) / DAY_MS);

                if (endDayIndex < startDayIndex) {
                    return null;
                }

                return {
                    ...event,
                    startDayIndex,
                    endDayIndex,
                };
            })
            .filter(Boolean)
            .sort((a, b) => a.startDayIndex - b.startDayIndex || a.endDayIndex - b.endDayIndex);

        const rowsLastEnd = [];

        return segments.map((segment) => {
            let rowIndex = rowsLastEnd.findIndex((endDayIndex) => segment.startDayIndex > endDayIndex);

            if (rowIndex === -1) {
                rowIndex = rowsLastEnd.length;
                rowsLastEnd.push(segment.endDayIndex);
            } else {
                rowsLastEnd[rowIndex] = segment.endDayIndex;
            }

            return {
                ...segment,
                rowIndex,
            };
        });
    }, [longEvents, monday]);

    const longEventsHeight = useMemo(() => {
        if (longEventSegments.length === 0) {
            return 0;
        }

        const rowHeight = 28;
        const rowGap = 6;
        const verticalPadding = 8;
        const maxRow = Math.max(...longEventSegments.map((segment) => segment.rowIndex));

        return (maxRow + 1) * rowHeight + maxRow * rowGap + verticalPadding * 2;
    }, [longEventSegments]);

    return (
        <section className={eventsPageStyle.weekCalendar}>
            <WeekCalendarHeader anchor={currentDate} selected={selected} onAnchorDateChange={onAnchorDateChange}
                                weekStart={weekStart}/>
            <div className={eventsPageStyle.weekBody}>
                {longEventSegments.length > 0 && (
                    <div className={eventsPageStyle.weekLongEvents}>
                        <div className={eventsPageStyle.weekLongEventsSpacer}/>
                        <div className={eventsPageStyle.weekLongEventsTrack} style={{height: `${longEventsHeight}px`}}>
                            {longEventSegments.map((segment, index) => {
                                const left = (segment.startDayIndex / DAY_COUNT_IN_WEEK) * 100;
                                const width = ((segment.endDayIndex - segment.startDayIndex + 1) / DAY_COUNT_IN_WEEK) * 100;

                                return (
                                    <div
                                        key={`${segment.startDate}-${segment.endDate}-${index}`}
                                        className={eventsPageStyle.weekLongEvent}
                                        style={{
                                            left: `${left}%`,
                                            width: `${width}%`,
                                            top: `${8 + (segment.rowIndex * 34)}px`,
                                        }}
                                    >
                                        {segment.title}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                <div className={eventsPageStyle.weekScroll}>
                    <div className={eventsPageStyle.weekTimes}>
                        {hours.map((h) => (
                            <div key={h} className={eventsPageStyle.weekTimeRow}>
                                <Text className={eventsPageStyle.weekTimeText} text={`${h}:00`}/>
                            </div>
                        ))}
                    </div>

                    <div className={eventsPageStyle.weekGrid}>
                        <div className={eventsPageStyle.weekGridInner} onClick={closePopup}>
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

                                    const dayIndex = getMondayBasedDayIndex(start);

                                    const overlap = 0 + index;

                                    const dayWidth = 100 / 7;
                                    const width = dayWidth / events.length;
                                    const left = (dayWidth * dayIndex) + (width * index) - (overlap * 0.3);

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
                                            onClick={(clickEvent) => {
                                                clickEvent.stopPropagation();
                                                openPopup({
                                                    event,
                                                    top,
                                                    height,
                                                    gridHeight,
                                                });
                                            }}
                                        />
                                    );
                                })
                            )}

                            {isPopupOpen && (
                                <CalendarInfoPopup
                                    event={selectedEvent}
                                    position={popupPosition}
                                    onClose={closePopup}
                                />
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
