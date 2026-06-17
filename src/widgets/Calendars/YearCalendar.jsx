import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Text} from "@shared/Text/Text.jsx";
import {Button} from "@shared/Button/Button.jsx";
import YearCalendarStyle from "@app/styles/year-calendar.module.css";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";
import { YearMiniCalendar } from "./YearMiniCalendar.jsx";
import {MoreEventsPopup} from "@widgets/Calendars/EventPopup/MoreEventsPopup.jsx";
import {CalendarInfoPopup} from "@widgets/Calendars/CalendarInfoPopup/CalendarInfoPopup.jsx";

export function YearCalendar({ year, onYearChangeView, selected, onSelect, apiRef }) {
    const scrollRef = useRef(null);

    const monthRefs = useMemo(
        () => Array.from({ length: 12 }, () => ({ current: null })),
        []
    );

    const scrollToMonth = useCallback((monthIndex) => {
        const el = monthRefs[monthIndex]?.current;
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [monthRefs]);

    useEffect(() => {
        if (!apiRef) return;
        apiRef.current = { scrollToMonth };
    }, [apiRef, monthRefs, scrollToMonth]);

    const [selectedMoreButton, setSelectedMoreButton] = useState(false);

    const closeMoreButton = () => {
        setSelectedMoreButton(false);
    };

    const moreEventsRef = useRef({});
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [infoPopupAnchor, setInfoPopupAnchor] = useState(null);
    const infoPopupRef = useRef(null);

    const openEventInfo = useCallback((event, element) => {
        setSelectedEvent(event);
        setInfoPopupAnchor(element);
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
        };
    }, [infoPopupAnchor]);

    const morePopupRef = useRef(null);
    const [view, setView] = useState(null);
    const dayButtonRefs = useRef({});

    return (
        <section className={YearCalendarStyle.calendarSection}>
            <div className={YearCalendarStyle.calendarContainer}>
                <div className={YearCalendarStyle.yearHeader}>
                    <div>
                        <Text text={String(year)} className={YearCalendarStyle.textHeader} />
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
                            <Media className={YearCalendarStyle.imageBtn} image={rightIcon} />
                        </Button>
                    </div>
                </div>

                <div className={YearCalendarStyle.yearScroll} ref={scrollRef}>
                    <div className={YearCalendarStyle.yearGrid}>
                        {Array.from({ length: 12 }, (_, monthIndex) => (
                            <div key={`${year}-${monthIndex}`} ref={monthRefs[monthIndex]}>
                                <YearMiniCalendar
                                    year={year}
                                    monthIndex={monthIndex}
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
                    isVisible={!!selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    style={popupStyle}
                    moreEventsRef={moreEventsRef}
                />
            )}
            {selectedMoreButton && (
                <MoreEventsPopup
                    isOpen={selectedMoreButton}
                    ignoreRefs={infoPopupRef}
                    onClose={closeMoreButton}
                    dayButtonRef={dayButtonRefs}
                    dayNumber={view.day}
                    moreEventsRef={moreEventsRef}
                    view={view}
                    onEventClick={openEventInfo}
                    ref={morePopupRef}
                />
            )}
        </section>
    );
}
