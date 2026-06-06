import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
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
    buildLongEventSegments,
    calcNowTopPx,
    groupEventsByDateMap
} from "@features/calendar/utils/weekCalendar.utils.js";
import {useElementHeight} from "@features/calendar/hooks/useElementHeight.js";
import {useNow} from "@features/calendar/hooks/useNow.js";
import WeekCalendarHeader from "@widgets/Calendars/WeekCalendar/components/WeekCalendarHeader.jsx";
import {useEventsBetweenDates} from "@features/get-calendar-events/hooks/useEventsBetweenDates.js";
import {useDivideCalendarEvents} from "@features/get-calendar-events/hooks/useDivideCalendarEvents.js";
import {getMinutesFromStartOfDay} from "@features/calendar/utils/dayCalendar.utils.js";
import {CalendarEvent} from "@widgets/Calendars/DayCalendar/components/CalendarEvent.jsx";
import {PX_PER_MINUTE} from "@features/calendar/constants/weekCalendar.constants.js";
import calendarInfoPopupStyle from "@app/styles/popup.module.css";
import {CalendarInfoPopup} from "@widgets/Calendars/CalendarInfoPopup/CalendarInfoPopup.jsx";
import {Button} from "@shared/Button/Button.jsx";
import {useClosePopupOnZoom} from "@features/calendar/hooks/useClosePopupOnZoom.js";

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


    const [selectedEvent, setSelectedEvent] = useState(null);
    const openPopup = (event) => {
        setSelectedEvent(event);
        requestAnimationFrame(() => {
            setIsPopupVisible(true);
        });
    };

    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const closePopup = () => {
        setIsPopupVisible(false);

        selectedLongEventRef.current = null;

        setTimeout(() => {
            setSelectedEvent(null);
        }, 220);
    };

    const weekBodyRef = useRef(null);

    useEffect(() => {
        const node = weekBodyRef.current;
        const mainNode = mainRef?.current;

        if (!node) {
            return;
        }

        const handleInnerScroll = () => {
            closePopup();
        };

        const handlePageScroll = () => {
            closePopup();
        };

        const handleClick = (e) => {
            const isEvent = e.target.closest(`.${eventsPageStyle.weekEvent}`);
            const isPopup = e.target.closest(`.${calendarInfoPopupStyle.calendarInfoPopup}`);

            if (!isEvent && !isPopup) {
                closePopup();
            }
        };

        node.addEventListener("scroll", handleInnerScroll);
        node.addEventListener("click", handleClick);

        if (mainNode) {
            mainNode.addEventListener("scroll", handlePageScroll, { passive: true });
        }

        return () => {
            node.removeEventListener("scroll", handleInnerScroll);
            node.removeEventListener("click", handleClick);

            if (mainNode) {
                mainNode.removeEventListener("scroll", handlePageScroll);
            }
        };
    }, [mainRef]);

    useClosePopupOnZoom({
        isEnabled: selectedEvent,
        onClose: closePopup,
    });


    const selectedEventNodeRef = useRef(null);
    const popupRef = useRef(null);
    const calendarHeaderRef = useRef(null);
    const selectedLongEventRef = useRef(null);
    const calenderEventsTrackRef = useRef(null);
    const [popupTop, setPopupTop] = useState(0);

    useLayoutEffect(() => {
        const headerNode = calendarHeaderRef.current;
        const eventNode = selectedEventNodeRef.current || selectedLongEventRef.current;
        const popupNode = popupRef.current;
        const container = weekBodyRef.current;

        if (!selectedEvent || !headerNode || !eventNode || !popupNode || !container) {
            return;
        }

        const headerHeight = headerNode.offsetHeight;
        const eventHeight = eventNode.offsetHeight;
        const popupHeight = popupNode.offsetHeight;
        const popupHalfHeight = popupHeight / 2;
        const paddingTop = 35;

        const eventRect = eventNode.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const distanceToEvent = eventRect.top - containerRect.top;

        let nextTop;
        if (window.innerHeight >= 645){
            if (distanceToEvent > popupHeight) {
                nextTop =
                    headerHeight +
                    distanceToEvent -
                    popupHeight + 145;
            }
            else if (eventNode === selectedLongEventRef.current){
                nextTop = eventRect.top + paddingTop;
            }
            else if (distanceToEvent < popupHeight && distanceToEvent > 0) {
                const progress = distanceToEvent / popupHeight;

                const topNearHeader = headerHeight;
                const topNearEvent =
                    headerHeight +
                    distanceToEvent +
                    eventHeight / 2 -
                    popupHalfHeight;

                nextTop =
                    topNearHeader +
                    (topNearEvent - topNearHeader) * progress;
            }
            else if (distanceToEvent < 0) {
                nextTop = headerHeight;
            }
        }
        else {
            nextTop = window.innerHeight / 2 - popupHeight / 2;
        }

        setPopupTop(nextTop);
    }, [selectedEvent]);

    const [popupLeft, setPopupLeft] = useState(0);

    useLayoutEffect(() => {
        const calendarNode = weekCalendarRef.current;
        const eventNode = selectedEventNodeRef.current || selectedLongEventRef.current;
        const popupNode = popupRef.current;

        if (!selectedEvent || !calendarNode || !eventNode || !popupNode) {
            return;
        }

        const calendarRect = calendarNode.getBoundingClientRect();
        const eventRect = eventNode.getBoundingClientRect();
        const popupWidth = popupNode.offsetWidth;

        let gap = 4;

        const start = new Date(selectedEvent.startDate);
        const dayIndex = getMondayBasedDayIndex(start);

        let leftDistanceForPopup = 800;
        let leftDistanceForMonday = 800;

        if (window.innerWidth <= 1150 && window.innerWidth > 1100) {
            leftDistanceForMonday = 750;
        }

        if (window.innerWidth <= 1100){
            leftDistanceForMonday = 480;
            leftDistanceForPopup = 480;
            gap = 0;
        }

        let nextLeft;

        if(eventNode === selectedLongEventRef.current){
            nextLeft = leftDistanceForPopup + gap + ((weekCalendarRef.current.offsetWidth - popupWidth) / 2);
        }
        else if (dayIndex === 0) {
            nextLeft = eventRect.right - calendarRect.left + gap + leftDistanceForMonday;
        }
        else if (dayIndex > 0){
            nextLeft = eventRect.left - calendarRect.left - popupWidth - gap + leftDistanceForPopup;
        }

        setPopupLeft(nextLeft);
    }, [selectedEvent, popupTop]);

    return (
        <section className={eventsPageStyle.weekCalendar} ref={weekCalendarRef}>
            <div className={eventsPageStyle.weekTop}>
                <WeekCalendarHeader anchor={currentDate} selected={selected} onAnchorDateChange={onAnchorDateChange}
                                    weekStart={weekStart} onSelect={onSelect} monday={monday} ref={calendarHeaderRef} />
                {longEventSegments.length > 0 && (
                    <div className={eventsPageStyle.weekLongEvents} >
                        <div className={eventsPageStyle.weekLongEventsSpacer}/>
                        <div
                            className={eventsPageStyle.weekLongEventsTrack}
                            style={{height: `${longEventsHeight}px`}}
                            ref={calenderEventsTrackRef}
                        >
                            {longEventSegments.map((segment, index) => {
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
                                    const isSelected = selectedEvent === event;

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
