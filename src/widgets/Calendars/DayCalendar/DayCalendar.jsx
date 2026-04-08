import {useMemo, useRef, useState, useEffect} from "react";
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
import {CalendarInfoPopup} from "@widgets/Calendars/CalendarInfoPopup/CalendarInfoPopup.jsx";
import calendarInfoPopupStyle from "@app/styles/popup.module.css"

export function DayCalendar({date, onChangeDate, onSelect}) {

    const viewDate = useMemo(() => {
        return date ?? new Date();
    }, [date]);

    const hours = useMemo(
        () => Array.from({length: 23}, (_, i) => `${i + 1}:00`),
        []
    );

    const gridRef = useRef(null);
    const gridHeight = useElementHeight(gridRef);

    const now = useNow(NOW_TICK_MS);
    const minutesFromStartOfDay = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const nowTop = gridHeight > 0 ? (minutesFromStartOfDay / (24 * 60)) * gridHeight : 0;
    const showNowLine = isSameDay(viewDate, now);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const events = useEventsBetweenDates({startDate: viewDate, endDate: viewDate});
    const {timelineEvents, longEvents} = useDivideCalendarEvents({events, viewDate});
    const sortedEvents = useMemo(
        () => prepareDayEvents(timelineEvents),
        [timelineEvents]
    );
    const dayBodyRef = useRef(null);
    const selectedEventNodeRef = useRef(null);
    const popupRef = useRef(null);
    const headerRef = useRef(null);
    const longEventRef = useRef(null);
    const [popupTop, setPopupTop] = useState(0);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const openPopup = (event) => {
        setSelectedEvent(event);
        requestAnimationFrame(() => {
            setIsPopupVisible(true);
        });
    };

    const closePopup = () => {
        setIsPopupVisible(false);

        setTimeout(() => {
            setSelectedEvent(null);
            setPopupTop(null);
        }, 220);
    };

    useEffect(() => {
        const node = dayBodyRef.current;

        if (!node) {
            return;
        }

        const handleScroll = () => {
            closePopup();
        };

        const handleClick = (e) => {
            const isEvent = e.target.closest(`.${eventsPageStyle.dayEvent}`);
            const isPopup = e.target.closest(`.${calendarInfoPopupStyle.calendarInfoPopup}`);

            if (!isEvent && !isPopup) {
                closePopup();
            }
        };


        node.addEventListener("scroll", handleScroll);
        node.addEventListener("click", handleClick);

        return () => {
            node.removeEventListener("scroll", handleScroll);
            node.removeEventListener("click", handleClick);
        };
    }, []);

    useEffect(() => {
        const container = dayBodyRef.current;
        const eventNode = selectedEventNodeRef.current;
        const popupNode = popupRef.current;
        const headerNode = headerRef.current;
        const longEventNode = longEventRef.current;


        if (!selectedEvent || !container || !eventNode || !popupNode || !headerNode) {
            return;
        }

        const visibleTop = eventNode.offsetTop - container.scrollTop;
        const popupHeight = popupNode.offsetHeight;
        const headerHeight = headerNode.offsetHeight;
        const longEventBlockHeight = longEventNode?.offsetHeight ?? 0;

        const eventHeight = eventNode.offsetHeight;
        const containerHeight = container.clientHeight;

        const eventVisibleBottom = visibleTop + eventHeight;

        const topBase = headerHeight + longEventBlockHeight;

        const spaceAbove = visibleTop;
        const spaceBelow = containerHeight - eventVisibleBottom;

        let nextTop;

        if (spaceAbove >= popupHeight) {
            nextTop = topBase + visibleTop - popupHeight;
        }

        else if (spaceBelow >= popupHeight) {
            nextTop = topBase + visibleTop + eventHeight;
        }

        else {
            nextTop = 0;
        }

        setPopupTop(nextTop);
    }, [selectedEvent, sortedEvents, longEvents.length]);


    return (
        <section className={eventsPageStyle.day} aria-label="Day calendar">
            <div className={eventsPageStyle.dayTop}>
                <DayCalendarHeader viewDate={viewDate} onChangeDate={onChangeDate} onSelect={onSelect} ref={headerRef}></DayCalendarHeader>
                {longEvents.length > 0 && (
                    <div className={eventsPageStyle.dayLongEvents} ref={longEventRef}>
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
                            const isSelected = selectedEvent === event;
                            return (
                                <CalendarEvent
                                    key={index}
                                    ref={isSelected ? selectedEventNodeRef : null}
                                    className={eventsPageStyle.dayEvent}
                                    style={{
                                        top: `${top}px`,
                                        height: `${height}px`,
                                        width: `${width}%`,
                                        left: `${left}%`,
                                        right: `${reservedRight}%`,
                                    }}
                                    title={event.title}
                                    onClick={() => openPopup(event)}
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
            {selectedEvent && (
                <CalendarInfoPopup
                    event={selectedEvent}
                    onClose={() => {
                        closePopup()
                    }}
                    isVisible={isPopupVisible}
                    style={{top: `${popupTop}px` , left: `50%` }}
                    ref={popupRef}
                />
            )}
        </section>
    );
}
