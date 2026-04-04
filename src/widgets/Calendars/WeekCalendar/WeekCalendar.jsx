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
import {
    buildLongEventSegments,
    groupEventsByDateMap
} from "@features/calendars/weekCalendar.utils.js";

export function WeekCalendarLayout(props) {

    const {date, selected, onAnchorDateChange, onSelect} = props;

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
    const weekCalendarRef = useRef(null);
    const gridHeight = useElementHeight(hLinesRef);
    const nowTop = useMemo(() => calcNowTopPx(now, gridHeight), [now, gridHeight]);
    const {
        isPopupOpen,
        selectedEvent,
        popupPosition,
        openPopup,
        closePopup,
    } = useCalendarEventInfoPopup();

    const result = groupEventsByDateMap(timelineEvents);

    const longEventSegments = useMemo(() => {
        const segments = buildLongEventSegments(longEvents, monday);

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
        <section className={eventsPageStyle.weekCalendar} ref={weekCalendarRef}>
            <div className={eventsPageStyle.weekTop}>
                <WeekCalendarHeader anchor={currentDate} selected={selected} onAnchorDateChange={onAnchorDateChange}
                                    weekStart={weekStart} onSelect={onSelect} monday={monday}/>
                {longEventSegments.length > 0 && (
                    <div className={eventsPageStyle.weekLongEvents}>
                        <div className={eventsPageStyle.weekLongEventsSpacer}/>
                        <div
                            className={eventsPageStyle.weekLongEventsTrack}
                            style={{height: `${longEventsHeight}px`}}
                            onClick={closePopup}
                        >
                            {longEventSegments.map((segment, index) => {
                                const left = (segment.startDayIndex / DAY_COUNT_IN_WEEK) * 100;
                                const width = ((segment.endDayIndex - segment.startDayIndex + 1) / DAY_COUNT_IN_WEEK) * 100;
                                const segmentTop = 8 + (segment.rowIndex * 34);

                                return (
                                    <div
                                        key={`${segment.startDate}-${segment.endDate}-${index}`}
                                        className={eventsPageStyle.weekLongEvent}
                                        style={{
                                            left: `${left}%`,
                                            width: `${width}%`,
                                            top: `${segmentTop}px`,
                                        }}
                                        onClick={(clickEvent) => {
                                            clickEvent.stopPropagation();
                                            const weekRect = weekCalendarRef.current?.getBoundingClientRect();
                                            const eventRect = clickEvent.currentTarget.getBoundingClientRect();
                                            const anchorTop = weekRect
                                                ? (eventRect.bottom - weekRect.top + 8)
                                                : (segmentTop + 36);

                                            openPopup({
                                                event: segment,
                                                anchorTop,
                                                placement: "below",
                                            });
                                        }}
                                    >
                                        {segment.title}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
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
                                                const weekRect = weekCalendarRef.current?.getBoundingClientRect();
                                                const eventRect = clickEvent.currentTarget.getBoundingClientRect();
                                                const anchorTop = weekRect
                                                    ? (eventRect.bottom - weekRect.top + 8)
                                                    : (top + height + 8);
                                                openPopup({
                                                    event,
                                                    top,
                                                    height,
                                                    gridHeight,
                                                    anchorTop,
                                                });
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
            {isPopupOpen && (
                <CalendarInfoPopup
                    event={selectedEvent}
                    position={popupPosition}
                    onClose={closePopup}
                />
            )}
        </section>
    );
}
