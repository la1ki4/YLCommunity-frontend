import {useCallback, useEffect, useMemo, useRef, useState} from "react";
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

    const [selectedMoreButton, setSelectedMoreButton] = useState(false);

    const closeMoreButton = () => {
        setSelectedMoreButton(false);
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

    useMoreEventsPopupPosition({
        view,
        dayButtonRefs,
        morePopupRef,
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
    const closePopup = useCallback(() => {
        setPopupVisible(false);

        setTimeout(() => {
            setSelectedEvent(null);
            setInfoPopupAnchor(null);
        }, 220);
    }, []);

    const popupStyle = useMemo(() => {
        if (!infoPopupAnchor) {
            return {};
        }

        const rect = infoPopupAnchor.getBoundingClientRect();

        return {
            position: "fixed",
            top: rect.top,
            left: rect.right + 12,
            zIndex: 3,
        };
    }, [infoPopupAnchor]);

    return (
        <section className={YearCalendarStyle.calendarSection}>
            <div className={YearCalendarStyle.calendarContainer}>
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
                                    onSelectedMoreButton={setSelectedMoreButton}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedEvent && (
                <CalendarInfoPopup
                    ref={infoPopupRef}
                    eventRefs={infoPopupRef}
                    event={selectedEvent}
                    isVisible={isPopupVisible}
                    onClose={closePopup}
                    style={popupStyle}
                    moreEventsRef={moreEventsRef}
                />
            )}
            {selectedMoreButton && (
                <MoreEventsPopup
                    isOpen={selectedMoreButton}
                    popupStyle={{
                        position: "absolute",
                        top: `${moreInfoPopupTop}px`,
                        left: `${moreInfoPopupLeft}px`,
                        transition: "top 220ms ease, left 220ms ease",
                        zIndex: 2
                    }}
                    ignoreRefs={morePopupIgnoreRefs}
                    onClose={closeMoreButton}
                    dayNumber={view.day}
                    moreEventsRef={moreEventsRef}
                    view={view}
                    onEventClick={openPopup}
                    ref={morePopupRef}
                />
            )}
        </section>
    );
}
