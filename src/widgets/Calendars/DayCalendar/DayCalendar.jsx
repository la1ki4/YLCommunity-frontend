import {useMemo, useRef} from "react";
import eventsPageStyle from "@app/styles/events.module.css";
import buttonStyle from "@app/styles/button.module.css";

import {NOW_TICK_MS} from "@features/calendar/constants/calendar.constants.js";
import {PX_PER_MINUTE} from "@features/calendar/constants/dayCalendar.constants.js"
import {getMinutesFromStartOfDay, prepareDayEvents} from "@features/calendar/utils/dayCalendar.utils.js";
import {useElementHeight} from "@features/calendar/hooks/useElementHeight.js";
import {useNow} from "@features/calendar/hooks/useNow.js";
import {useEventsBetweenDates} from "@features/get-calendar-events/hooks/useEventsBetweenDates.js"
import {useDivideCalendarEvents} from "@features/get-calendar-events/hooks/useDivideCalendarEvents.js"
import {isSameDay} from "@features/calendar/utils/dateMatch.utils.js";
import {CalendarEvent} from "@widgets/Calendars/DayCalendar/components/CalendarEvent.jsx";
import {DayCalendarHeader} from "@widgets/Calendars/DayCalendar/components/DayCalendarHeader.jsx";

export function DayCalendar({date, onChangeDate, onSelect}) {

    const viewDate = useMemo(() => {
        return date ?? new Date();
    }, [date]);

    const hours = useMemo(
        () => Array.from({length: 23}, (_, i) => `${i + 1}:00`),
        []
    );

    const gridRef = useRef(null);
    const dayBodyRef = useRef(null);
    const gridHeight = useElementHeight(gridRef);

    const now = useNow(NOW_TICK_MS);
    const minutesFromStartOfDay = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const nowTop = gridHeight > 0 ? (minutesFromStartOfDay / (24 * 60)) * gridHeight : 0;
    const showNowLine = isSameDay(viewDate, now);
    const events = useEventsBetweenDates({startDate: viewDate, endDate: viewDate});
    const {timelineEvents, longEvents} = useDivideCalendarEvents({events, viewDate});
    const sortedEvents = useMemo(
        () => prepareDayEvents(timelineEvents),
        [timelineEvents]
    );

    return (
        <section className={eventsPageStyle.day} aria-label="Day calendar">
            <div className={eventsPageStyle.dayTop}>
                <DayCalendarHeader viewDate={viewDate} onChangeDate={onChangeDate} onSelect={onSelect}></DayCalendarHeader>
                {longEvents.length > 0 && (
                    <div className={eventsPageStyle.dayLongEvents}>
                        {longEvents.map((event, index) => (
                            <button
                                type="button"
                                key={`${event.startDate}-${event.endDate}-${index}`}
                                className={`${eventsPageStyle.dayLongEvent} ${buttonStyle.dayLongEventButton}`}
                            >
                                {event.title}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className={eventsPageStyle.dayBody} ref={dayBodyRef}>
                <div className={eventsPageStyle.timeline}>
                    <div className={eventsPageStyle.timeCol} aria-hidden="true">
                        {hours.map((time) => (
                            <div key={time} className={eventsPageStyle.time}>
                                {time}
                            </div>
                        ))}
                    </div>

                    <div className={eventsPageStyle.gridCol} ref={gridRef}>
                        {Array.from({length: 24}).map((i) => (
                            <div key={i} className={eventsPageStyle.row}/>
                        ))}


                        {sortedEvents.map((event, index) => {
                            const startMinutes = getMinutesFromStartOfDay(event.start);
                            const durationMinutes = (event.end - event.start) / 1000 / 60;

                            const top = startMinutes * PX_PER_MINUTE;
                            const height = durationMinutes * PX_PER_MINUTE;

                            const reservedRight = 3;
                            const overlapGap = 1;

                            const availableWidth = 100 - reservedRight + overlapGap;

                            const width = availableWidth / event.overlapCount;
                            const left = (width - overlapGap) * event.overlapIndex;
                            return (
                                <CalendarEvent
                                    key={index}
                                    className={eventsPageStyle.dayEvent}
                                    style={{
                                        top: `${top}px`,
                                        height: `${height}px`,
                                        width: `${width}%`,
                                        left: `${left}%`,
                                        right: `${reservedRight}%`,
                                    }}
                                    title={event.title}
                                />
                            );
                        })}

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
