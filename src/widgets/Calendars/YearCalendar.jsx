import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Text} from "@shared/Text/Text.jsx";
import {Button} from "@shared/Button/Button.jsx";
import YearCalendarStyle from "@app/styles/year-calendar.module.css";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";
import {YearMiniCalendar} from "./YearMiniCalendar.jsx";
import {MoreEventsPopup} from "@widgets/Calendars/EventPopup/MoreEventsPopup.jsx";
import {CalendarInfoPopup} from "@widgets/Calendars/CalendarInfoPopup/CalendarInfoPopup.jsx";
import {useMoreEventsPopupPosition} from "@features/calendar/hooks/year/useMoreEventsPopupYearCalendarPosition.js";
import {useClosePopupOnZoom} from "@features/calendar/hooks/useClosePopupOnZoom.js";
import {useCloseOnHandScroll} from "@features/calendar/hooks/useCloseOnHandScroll.js";
import {useEventsBetweenDates} from "@features/calendar/requests/get-calendar-events/hooks/useEventsBetweenDates.js";
import {useDeleteEvent} from "@features/calendar/hooks/useDeleteEvent.js";

export function YearCalendar({year, onYearChangeView, selected, onSelect, apiRef}) {
    const scrollRef = useRef(null);

    const monthRefs = useMemo(
        () => Array.from({length: 12}, () => ({current: null})),
        []
    );

    const scrollToMonth = useCallback((monthIndex) => {
        const el = monthRefs[monthIndex]?.current;
        if (!el) return;
        el.scrollIntoView({behavior: "smooth", block: "start"});
    }, [monthRefs]);

    useEffect(() => {
        if (!apiRef) return;
        apiRef.current = {scrollToMonth};
    }, [apiRef, monthRefs, scrollToMonth]);

    const [selectedMorePopupButton, setSelectedMorePopupButton] = useState(null);
    const [isMorePopupVisible, setIsMorePopupVisible] = useState(false);

    const closeMorePopup = () => {
        setIsMorePopupVisible(false);

        setTimeout(() => {
            setSelectedMorePopupButton(false);
        }, 220)
    };

    const moreEventsRef = useRef({});
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const infoPopupRef = useRef(null);

    const morePopupRef = useRef(null);
    const [view, setView] = useState(null);
    const dayButtonRefs = useRef({});
    const yearMiniCalendarRef = useRef(null);
    const yearMiniCalendarWeekRef = useRef(null);

    const [moreInfoPopupTop, setMoreInfoPopupTop] = useState(0);
    const [moreInfoPopupLeft, setMoreInfoPopupLeft] = useState(0);
    const [monthCalendarPositionIndex, setMonthCalendarPositionIndex] = useState(0);
    const calendarContainerRef = useRef(null);

    const date = useMemo(() => {
        if (view !== null) {
            return new Date(
                view.year,
                view.monthIndex,
                view.day,
            );
        }
    },[view]);

    const serverEvents = useEventsBetweenDates({
        startDate: date,
        endDate: date,
    });

    const [events, setEvents] = useState([]);
    const closePopup = useCallback(() => {
        setPopupVisible(false);

        setTimeout(() => {
            setSelectedEvent(null);
            setInfoPopupAnchor(null);
        }, 220);
    }, []);

    useEffect(() => {
        setEvents(serverEvents);
    }, [serverEvents])
    const removeEvent = useDeleteEvent({
        setEvents,
        closePopup,
    });

    useMoreEventsPopupPosition({
        view,
        dayButtonRefs,
        morePopupRef,
        calendarContainerRef,
        scrollRef,
        yearMiniCalendarRef,
        monthCalendarPositionIndex,
        setMonthCalendarPositionIndex,
        setMoreInfoPopupTop,
        setMoreInfoPopupLeft,
    });

    const morePopupIgnoreRefs = [infoPopupRef, dayButtonRefs];

    const [infoPopupAnchor, setInfoPopupAnchor] = useState(null);
    const openPopup = useCallback((event, element) => {
        setInfoPopupAnchor(element);
        setSelectedEvent(event);

        requestAnimationFrame(() => {
            setPopupVisible(true);
        });
    }, []);

    const [popupStyle, setPopupStyle] = useState({});

    useLayoutEffect(() => {
        if (!infoPopupAnchor || !infoPopupRef.current) {
            return;
        }

        const rect = infoPopupAnchor.getBoundingClientRect();
        const calendarContainerRect =
            calendarContainerRef.current.getBoundingClientRect();

        const infoPopupRect =
            infoPopupRef.current.getBoundingClientRect();

        if (window.innerWidth > 900) {
            setPopupStyle({
                position: "fixed",
                top: rect.top,
                left: rect.right + 12,
                zIndex: 3,
            });
        } else {
            setPopupStyle({
                position: "absolute",
                top:
                    calendarContainerRect.height / 2 -
                    infoPopupRect.height / 2,
                left:
                    window.innerWidth / 2 -
                    infoPopupRect.width / 2,
                zIndex: 3,
            });
        }
    }, [
        infoPopupAnchor,
    ]);

    useClosePopupOnZoom({
        isEnabled: selectedEvent,
        onClose: closePopup,
    });

    useClosePopupOnZoom({
        isEnabled: selectedMorePopupButton,
        onClose: closeMorePopup,
    });

    useCloseOnHandScroll({
        scrollRef,
        isOpen: isPopupVisible,
        closePopup,
    });

    useCloseOnHandScroll({
        scrollRef,
        isOpen: selectedMorePopupButton,
        closePopup: closeMorePopup,
    });

    return (
        <section className={YearCalendarStyle.calendarSection}>
            <div className={YearCalendarStyle.calendarContainer} ref={calendarContainerRef}>
                <div className={YearCalendarStyle.yearHeader}>
                    <div>
                        <Text text={String(year)} className={YearCalendarStyle.textHeader}/>
                    </div>

                    <div>
                        <Button
                            className={YearCalendarStyle.navBtn}
                            onClick={() => onYearChangeView((y) => y - 1)}
                        >
                            <Media
                                className={`${YearCalendarStyle.imageBtn} ${YearCalendarStyle.mr30px}`}
                                image={leftIcon}
                            />
                        </Button>

                        <Button
                            className={YearCalendarStyle.navBtn}
                            onClick={() => onYearChangeView((y) => y + 1)}
                        >
                            <Media className={YearCalendarStyle.imageBtn} image={rightIcon}/>
                        </Button>
                    </div>
                </div>

                <div className={YearCalendarStyle.yearScroll} ref={scrollRef}>
                    <div className={YearCalendarStyle.yearGrid}>
                        {Array.from({length: 12}, (_, monthIndex) => (
                            <div key={`${year}-${monthIndex}`} ref={monthRefs[monthIndex]}>
                                <YearMiniCalendar
                                    year={year}
                                    yearMiniCalendarRef={yearMiniCalendarRef}
                                    monthIndex={monthIndex}
                                    yearMiniCalendarWeekRef={yearMiniCalendarWeekRef}
                                    dayButtonRefs={dayButtonRefs}
                                    setView={setView}
                                    selected={selected}
                                    onSelect={onSelect}
                                    onSelectedMoreButton={setSelectedMorePopupButton}
                                    setIsMorePopupVisible={setIsMorePopupVisible}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedEvent && (
                <CalendarInfoPopup
                    ref={infoPopupRef}
                    onDelete={removeEvent}
                    eventRefs={infoPopupRef}
                    event={selectedEvent}
                    isVisible={isPopupVisible}
                    onClose={closePopup}
                    style={popupStyle}
                    moreEventsRef={moreEventsRef}
                />
            )}
            {selectedMorePopupButton && (
                <MoreEventsPopup
                    isOpen={selectedMorePopupButton}
                    popupStyle={{
                        position: "absolute",
                        top: `${moreInfoPopupTop}px`,
                        left: `${moreInfoPopupLeft}px`,
                        zIndex: 2,

                        opacity: isMorePopupVisible ? 1 : 0,
                        transform: isMorePopupVisible
                            ? "scale(1)"
                            : "scale(0.95)",

                        transition: `top 220ms ease, left 220ms ease, opacity 220ms ease, transform 220ms ease`,
                    }}
                    ignoreRefs={morePopupIgnoreRefs}
                    onClose={closeMorePopup}
                    dayNumber={view.day}
                    events={events}
                    moreEventsRef={moreEventsRef}
                    view={view}
                    onEventClick={openPopup}
                    ref={morePopupRef}
                />
            )}
        </section>
    );
}
