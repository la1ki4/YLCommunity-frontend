import {useMemo, useRef, useState} from "react";
import eventsPageStyle from "@app/styles/events.module.css";
import buttonStyle from "@app/styles/button.module.css";
import {NOW_TICK_MS} from "@features/calendar/constants/calendar.constants.js";
import {
    calculateEventPositionAndSize,
    prepareDayEvents
} from "@features/calendar/utils/dayCalendar.utils.js";
import {useElementHeight} from "@features/calendar/hooks/useElementHeight.js";
import {useNow} from "@features/calendar/hooks/useNow.js";
import {useEventsBetweenDates} from "@features/get-calendar-events/hooks/useEventsBetweenDates.js"
import {useDivideCalendarEvents} from "@features/get-calendar-events/hooks/useDivideCalendarEvents.js"
import {isSameDay} from "@features/calendar/utils/dateMatch.utils.js";
import {CalendarEvent} from "@widgets/Calendars/DayCalendar/components/CalendarEvent.jsx";
import {DayCalendarHeader} from "@widgets/Calendars/DayCalendar/components/DayCalendarHeader.jsx";
import {CalendarInfoPopup} from "@widgets/Calendars/CalendarInfoPopup/CalendarInfoPopup.jsx";
import {useClosePopupOnZoom} from "@features/calendar/hooks/useClosePopupOnZoom.js";
import {
    useSetDefaultEventTopPopupPosition,
    useSetLongEventTopPopupPosition
} from "@features/calendar/hooks/day/usePopupPosition.js";
import {useRemoveEventPopupOnScrollAndClick} from "@features/calendar/hooks/day/useRemoveEventPopup.js";
import {createEventPopupHandlers} from "@features/calendar/utils/eventPopup.utils.js";

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
    const selectedLongEventNodeRef = useRef(null);

    const {
        openPopup,
        closePopup,
    } = createEventPopupHandlers({
        setIsPopupVisible,
        setSelectedEvent,
    });

    useRemoveEventPopupOnScrollAndClick({
        dayBodyRef,
        closePopup,
    });

    useSetDefaultEventTopPopupPosition({
        selectedEvent,
        sortedEvents,
        longEventsLength: longEvents.length,

        dayBodyRef,
        selectedEventNodeRef,
        popupRef,
        headerRef,
        longEventRef,

        setPopupTop,
    });

    useSetLongEventTopPopupPosition({
        selectedEvent,
        longEventsLength: longEvents.length,

        selectedLongEventNodeRef,
        popupRef,
        dayBodyRef,

        setPopupTop,
    });

    useClosePopupOnZoom({
        isEnabled: isPopupVisible,
        onClose: closePopup,
    });

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
                                ref={selectedEvent === event ? selectedLongEventNodeRef : null}
                                onClick={() => openPopup(event)}
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
                            const {
                                top,
                                height,
                                left,
                                width,
                                isSelected,
                                reservedRight,
                            } = calculateEventPositionAndSize({
                                event,
                                selectedEvent,
                            });
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
