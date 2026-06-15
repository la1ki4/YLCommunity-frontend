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
import {
    buildHours,
    calcNowTopPx, eventSizeAndPos,
    groupEventsByDateMap, longEventSegments, WeekCalendarLongEventsHeight
} from "@features/calendar/utils/weekCalendar.utils.js";
import {useElementHeight} from "@features/calendar/hooks/useElementHeight.js";
import {useNow} from "@features/calendar/hooks/useNow.js";
import WeekCalendarHeader from "@widgets/Calendars/WeekCalendar/components/WeekCalendarHeader.jsx";
import {useEventsBetweenDates} from "@features/get-calendar-events/hooks/useEventsBetweenDates.js";
import {useDivideCalendarEvents} from "@features/get-calendar-events/hooks/useDivideCalendarEvents.js";
import {CalendarEvent} from "@widgets/Calendars/DayCalendar/components/CalendarEvent.jsx";
import {CalendarInfoPopup} from "@widgets/Calendars/CalendarInfoPopup/CalendarInfoPopup.jsx";
import {Button} from "@shared/Button/Button.jsx";
import {useClosePopupOnZoom} from "@features/calendar/hooks/useClosePopupOnZoom.js";
import {useLeftPosition, useTopPosition} from "@features/calendar/hooks/week/useWeekCalendarEventPopupPosition.js";
import {useScrollWeekCalendarInside} from "@features/calendar/hooks/week/useWeekCalendarScrool.js";
import {createEventPopupHandlers} from "@features/calendar/utils/eventPopup.utils.js";

export function WeekCalendarLayout(props) {

    const {date, selected, onAnchorDateChange, onSelect, mainRef} = props;

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

    const result = groupEventsByDateMap(timelineEvents);

    const longEventSegmentsData =
        useMemo(
            () =>
                longEventSegments(
                    longEvents,
                    monday
                ),
            [longEvents, monday]
        );

    const longEventsHeight = useMemo(() => {
        return WeekCalendarLongEventsHeight(
            longEventSegmentsData
        );
    }, [longEventSegmentsData]);


    const [selectedEvent, setSelectedEvent] = useState(null);

    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const {
        openPopup,
        closePopup,
    } = createEventPopupHandlers({
        setIsPopupVisible,
        setSelectedEvent,
    });

    const weekBodyRef = useRef(null);

    useScrollWeekCalendarInside({
        weekBodyRef,
        mainRef,
        closePopup,
    });

    useClosePopupOnZoom({
        isEnabled: selectedEvent,
        onClose: closePopup,
    });

    const popupRef = useRef(null);
    const calendarHeaderRef = useRef(null);
    const selectedLongEventRef = useRef(null);
    const calenderEventsTrackRef = useRef(null);
    const selectedEventNodeRef = useRef(null);
    const [popupTop, setPopupTop] = useState(0);

    useTopPosition({
        selectedEvent,

        calendarHeaderRef,
        weekBodyRef,

        selectedEventNodeRef,
        selectedLongEventRef,
        popupRef,

        setPopupTop,
    });

    const [popupLeft, setPopupLeft] = useState(0);

    useLeftPosition({
        selectedEvent,
        popupTop,

        weekCalendarRef,
        selectedEventNodeRef,
        selectedLongEventRef,
        popupRef,

        setPopupLeft,
    });

    return (
        <section className={eventsPageStyle.weekCalendar} ref={weekCalendarRef}>
            <div className={eventsPageStyle.weekTop}>
                <WeekCalendarHeader anchor={currentDate} selected={selected} onAnchorDateChange={onAnchorDateChange}
                                    weekStart={weekStart} onSelect={onSelect} monday={monday} ref={calendarHeaderRef} />
                {longEventSegmentsData.length > 0 && (
                    <div className={eventsPageStyle.weekLongEvents} >
                        <div className={eventsPageStyle.weekLongEventsSpacer}/>
                        <div
                            className={eventsPageStyle.weekLongEventsTrack}
                            style={{height: `${longEventsHeight}px`}}
                            ref={calenderEventsTrackRef}
                        >
                            {longEventSegmentsData.map((segment, index) => {
                                const left = (segment.startDayIndex / DAY_COUNT_IN_WEEK) * 100;
                                const width = ((segment.endDayIndex - segment.startDayIndex + 1) / DAY_COUNT_IN_WEEK) * 100;
                                const segmentTop = 8 + (segment.rowIndex * 34);

                                return (
                                    <Button
                                        key={`${segment.startDate}-${segment.endDate}-${index}`}
                                        className={eventsPageStyle.weekLongEvent}
                                        style={{
                                            left: `${left}%`,
                                            width: `${width}%`,
                                            top: `${segmentTop}px`,
                                        }}
                                        onClick={(e) => {
                                            selectedLongEventRef.current = e.currentTarget;
                                            openPopup(segment);
                                        }}
                                    >
                                        {segment.title}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            <div className={eventsPageStyle.weekBody}>
                <div className={eventsPageStyle.weekScroll} ref={weekBodyRef}>
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

                            {Array.from(result.entries()).map(([, events]) =>
                                events.map((event, index) => {
                                    const {
                                        top,
                                        height,
                                        left,
                                        width,
                                        isSelected,
                                    } = eventSizeAndPos({
                                        event,
                                        index,
                                        selectedEvent,
                                    });

                                    return (
                                        <CalendarEvent
                                            key={event.id}
                                            title={event.title}
                                            ref={isSelected ? selectedEventNodeRef : null}
                                            className={eventsPageStyle.weekEvent}
                                            style={{
                                                top: `${top}px`,
                                                height: `${height}px`,
                                                left: `${left}%`,
                                                width: `${width}%`,
                                            }}
                                            onClick={() => openPopup(event)}
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
            {selectedEvent && (
                <CalendarInfoPopup
                    event={selectedEvent}
                    onClose={closePopup}
                    isVisible={isPopupVisible}
                    ref={popupRef}
                    style={{
                        top: `${popupTop}px`,
                        left: `${popupLeft}px`,
                    }}
                />
            )}
        </section>
    );
}
