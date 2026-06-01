import {Button} from "@shared/Button/Button.jsx";
import MonthCalendarStyle from "@app/styles/month-calendar.module.css";
import {Text} from "@shared/Text/Text.jsx";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";

import {DOW, MONTH_NAMES} from "@features/calendar/constants/calendar.constants.js";
import {shiftMonth} from "@features/calendar/utils/monthCalendar.utils.js";
import {useMonthGrid} from "@features/calendar/hooks/useMonthGrid.js";
import {useEventsBetweenDates} from "@features/get-calendar-events/hooks/useEventsBetweenDates.js";
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {getMonday, getSunday} from "@features/calendar/utils/calendarDate.utils.js";
import {CalendarInfoPopup} from "@widgets/Calendars/CalendarInfoPopup/CalendarInfoPopup.jsx";


export function MonthCalendar({view, onChangeView}) {
    const calendar = useMonthGrid(view.year, view.monthIndex);
    const headerText = `${MONTH_NAMES[view.monthIndex]}, ${view.year}`;

    const startDate = useMemo(() => {
        return new Date(view.year, view.monthIndex, 1);
    }, [view.year, view.monthIndex]);

    const endDate = useMemo(() => {
        return new Date(view.year, view.monthIndex + 1, 0);
    }, [view.year, view.monthIndex]);

    const monthEvents = useEventsBetweenDates({startDate: startDate, endDate: endDate});

    const monthEventsGroup = monthEvents.reduce((acc, event) => {
        const currentDate = new Date(event.startDate);
        const endEventDate = new Date(event.endDate);

        while (currentDate <= endEventDate) {
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const year = currentDate.getFullYear();

            const key = `${day}-${month}-${year}`;

            if (!acc[key]) {
                acc[key] = [];
            }

            acc[key].push(event);

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return acc;
    }, {});

    const [cellSize, setCellSize] = useState({
        width: 0,
        height: 0,
    });
    const cellRef = useRef(null);

    useEffect(() => {
        if (!cellRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            const borderSize = entry.borderBoxSize?.[0];

            const width = borderSize?.inlineSize ?? entry.contentRect.width;
            const height = borderSize?.blockSize ?? entry.contentRect.height;

            setCellSize((prev) => {
                if (
                    Math.abs(prev.width - width) < 1 &&
                    Math.abs(prev.height - height) < 1
                ) {
                    return prev;
                }

                return {
                    width,
                    height,
                };
            });
        });

        observer.observe(cellRef.current);

        return () => observer.disconnect();
    }, []);

    function getEventBlockWidth(event, currentDate) {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);

        const monday = getMonday(currentDate);
        const sunday = getSunday(currentDate);

        const startUtc = Date.UTC(
            start.getFullYear(),
            start.getMonth(),
            start.getDate()
        );

        const endUtc = Date.UTC(
            end.getFullYear(),
            end.getMonth(),
            end.getDate()
        );

        const mondayUtc = Date.UTC(
            monday.getFullYear(),
            monday.getMonth(),
            monday.getDate()
        );

        const sundayUtc = Date.UTC(
            sunday.getFullYear(),
            sunday.getMonth(),
            sunday.getDate()
        );

        const visibleStartUtc =
            startUtc < mondayUtc
                ? mondayUtc
                : startUtc;

        const visibleEndUtc =
            endUtc > sundayUtc
                ? sundayUtc
                : endUtc;

        return (
            (visibleEndUtc - visibleStartUtc) /
            (1000 * 60 * 60 * 24) + 1
        );
    }

    function sortEventsByDuration(events) {
        return [...events].sort((a, b) => {
            const aStart = new Date(a.startDate);
            const aEnd = new Date(a.endDate);

            const bStart = new Date(b.startDate);
            const bEnd = new Date(b.endDate);

            const aDuration =
                (Date.UTC(
                        aEnd.getFullYear(),
                        aEnd.getMonth(),
                        aEnd.getDate()
                    ) -
                    Date.UTC(
                        aStart.getFullYear(),
                        aStart.getMonth(),
                        aStart.getDate()
                    )) /
                (1000 * 60 * 60 * 24);

            const bDuration =
                (Date.UTC(
                        bEnd.getFullYear(),
                        bEnd.getMonth(),
                        bEnd.getDate()
                    ) -
                    Date.UTC(
                        bStart.getFullYear(),
                        bStart.getMonth(),
                        bStart.getDate()
                    )) /
                (1000 * 60 * 60 * 24);

            if (bDuration !== aDuration) {
                return bDuration - aDuration;
            }

            return aStart - bStart;
        });
    }

    const dayNumberRef = useRef(null);
    const moreButtonRef = useRef(null);
    const [elementSizes, setElementSizes] = useState({
        dayNumberHeight: 0,
        buttonHeight: 0,
    });

    useEffect(() => {
        const dayNumberHeight =
            dayNumberRef.current?.getBoundingClientRect().height || 0;

        const buttonHeight =
            moreButtonRef.current?.getBoundingClientRect().height || 0;

        setElementSizes({
            dayNumberHeight,
            buttonHeight,
        });
    }, [cellSize.height]);


    const [selectedEvent, setSelectedEvent] = useState(null);
    const selectedEventRef = useRef(null);
    const selectedRowIndexRef = useRef(null);
    const selectedColIndexRef = useRef(null);

    const openPopup = (event, element, rowIndex, colIndex) => {
        selectedEventRef.current = element;
        selectedRowIndexRef.current = rowIndex;
        selectedColIndexRef.current = colIndex;

        setSelectedEvent(event);

        requestAnimationFrame(() => {
            setIsPopupVisible(true);
        });
    };

    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const closePopup = () => {
        setIsPopupVisible(false);

        selectedEventRef.current = null;

        setTimeout(() => {
            setSelectedEvent(null);
        }, 220);
    };

    const popupRef = useRef(null);
    const calendarHeaderRef = useRef(null);
    const monthEventRef = useRef(null);
    const calendarSectionRef = useRef(null);
    const calendarRowRef = useRef(null);
    const [popupTop, setPopupTop] = useState(0);
    const [popupLeft, setPopupLeft] = useState(0);


    function calculatePopupLeft({
                                    calendarRect,
                                    eventRect,
                                    popupRect,
                                    calendarSectionRect,
                                    calendarCellRect,
                                    colIndex,
                                }) {
        const GAP = 800;

        const spaceLeft = calendarSectionRect.width - (calendarSectionRect.width - calendarCellRect.width * colIndex);

        const spaceRight = calendarSectionRect.width - (spaceLeft + eventRect.width);

        console.log(spaceRight)

        if (popupRect.width <= spaceLeft) {
            return (
                eventRect.left -
                calendarRect.left -
                popupRect.width +
                GAP
            );
        }

        if (popupRect.width <= spaceRight) {
            return (
                eventRect.right -
                calendarRect.left +
                GAP
            );
        }

        return (
            calendarRect.width / 2 -
            popupRect.width / 2 +
            GAP
        );
    }

    function calculatePopupTop({
                                   calendarRect,
                                   eventRect,
                                   popupRect,
                                   calendarHeaderRect,
                                   calendarSectionRect,
                                   calendarRowRect,
                                   rowIndex,
                               }) {
        const GAP = 12;

        const spaceBottom = (calendarSectionRect.height - calendarHeaderRect.height) - (calendarRowRect.height * (1 + rowIndex));


        if (spaceBottom > popupRect.height + GAP) {
            return (
                eventRect.top -
                calendarRect.top -
                popupRect.height +
                calendarHeaderRect.height +
                popupRect.height -
                GAP
            );
        }
        return (
            eventRect.top -
            calendarRect.top -
            popupRect.height +
            calendarHeaderRect.height -
            GAP
        );
    }

    useEffect(() => {
        if (!isPopupVisible) {
            return;
        }

        const preventZoom = (event) => {
            if (event.ctrlKey) {
                event.preventDefault();
            }
        };

        const preventZoomKeys = (event) => {
            if (
                event.ctrlKey &&
                [
                    "Equal",
                    "Minus",
                    "NumpadAdd",
                    "NumpadSubtract",
                ].includes(event.code)
            ) {
                event.preventDefault();
            }
        };

        const preventGesture = (event) => {
            event.preventDefault();
        };

        document.addEventListener("wheel", preventZoom, {
            passive: false,
        });

        document.addEventListener("keydown", preventZoomKeys);

        document.addEventListener("gesturestart", preventGesture);
        document.addEventListener("gesturechange", preventGesture);
        document.addEventListener("gestureend", preventGesture);

        return () => {
            document.removeEventListener("wheel", preventZoom);

            document.removeEventListener("keydown", preventZoomKeys);

            document.removeEventListener("gesturestart", preventGesture);
            document.removeEventListener("gesturechange", preventGesture);
            document.removeEventListener("gestureend", preventGesture);
        };
    }, [isPopupVisible]);

    useLayoutEffect(() => {
        const calendarNode = calendarHeaderRef.current;
        const eventNode = selectedEventRef.current;
        const popupNode = popupRef.current;
        const calendarHeaderNode = calendarHeaderRef.current;
        const calendarSectionNode = calendarSectionRef.current;
        const calendarRowNode = calendarRowRef.current;
        const calendarCellNode = cellRef.current;

        if (
            !selectedEvent ||
            !calendarNode ||
            !eventNode ||
            !popupNode
        ) {
            return;
        }

        const calendarRect =
            calendarNode.getBoundingClientRect();

        const eventRect =
            eventNode.getBoundingClientRect();

        const popupRect =
            popupNode.getBoundingClientRect();

        const calendarHeaderRect = calendarHeaderNode.getBoundingClientRect();

        const calendarSectionRect = calendarSectionNode.getBoundingClientRect();

        const calendarRowRect = calendarRowNode.getBoundingClientRect();

        const calendarCellRect = calendarCellNode.getBoundingClientRect();

        const rowIndex = selectedRowIndexRef.current;
        const colIndex = selectedColIndexRef.current;

        setPopupLeft(
            calculatePopupLeft({
                calendarRect,
                eventRect,
                popupRect,
                calendarSectionRect,
                calendarCellRect,
                colIndex,
            })
        );

        setPopupTop(
            calculatePopupTop({
                calendarRect,
                eventRect,
                popupRect,
                calendarHeaderRect,
                calendarSectionRect,
                calendarRowRect,
                rowIndex
            })
        );
    }, [selectedEvent, isPopupVisible]);

    return (
        <section className={MonthCalendarStyle.calendarSection} ref={calendarSectionRef}>
            <div className={MonthCalendarStyle.calendarHeader} ref={calendarHeaderRef}>
                <div>
                    <Text className={MonthCalendarStyle.textHeader} text={headerText}/>
                </div>

                <div className={MonthCalendarStyle.btnBlock}>
                    <Button
                        className={MonthCalendarStyle.navBtn}
                        onClick={() => onChangeView((v) => shiftMonth(v.year, v.monthIndex, -1))}
                    >
                        <Media
                            className={`${MonthCalendarStyle.imageBtn} ${MonthCalendarStyle.mr30px}`}
                            image={leftIcon}
                        />
                    </Button>

                    <Button
                        className={MonthCalendarStyle.navBtn}
                        onClick={() => onChangeView((v) => shiftMonth(v.year, v.monthIndex, +1))}
                    >
                        <Media className={MonthCalendarStyle.imageBtn} image={rightIcon}/>
                    </Button>
                </div>
            </div>

            <div className={MonthCalendarStyle.calendarGrid}>
                {calendar.map((week, rowIndex) => {
                    return (
                        <div key={rowIndex} className={MonthCalendarStyle.weekRow} ref={calendarRowRef}>
                            {week.map((cell, colIndex) => {
                                const currentDate = new Date(view.year, view.monthIndex, cell.label);
                                const day = String(currentDate.getDate()).padStart(2, '0');
                                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                                const year = currentDate.getFullYear();
                                const key = `${day}-${month}-${year}`;
                                const dayEvents = sortEventsByDuration(monthEventsGroup[key] || []);

                                const visibleEventsCount =
                                    cellSize.height <= 90
                                        ? 0
                                        : cellSize.height <= 137
                                            ? 1
                                            : 2;
                                const hiddenEventsCount = dayEvents.length - visibleEventsCount;
                                const buttonTop = (() => {
                                    const {dayNumberHeight, buttonHeight} = elementSizes;

                                    if (visibleEventsCount === 0) {
                                        if (cellSize.height -
                                            dayNumberHeight -
                                            buttonHeight > 0) {
                                            if (rowIndex === 0) {
                                                return (cellSize.height / 2) - buttonHeight;
                                            }
                                            return (
                                                cellSize.height -
                                                dayNumberHeight -
                                                buttonHeight
                                            );
                                        } else {
                                            return 0;
                                        }

                                    }

                                    if (visibleEventsCount === 1) {
                                        return Math.max(
                                            (rowIndex === 0 ? 55 : 35) +
                                            35 -
                                            (137 - cellSize.height),
                                            60
                                        );
                                    }

                                    return (rowIndex === 0 ? 55 : 35) + 70;
                                })();


                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={MonthCalendarStyle.dayCell}
                                        ref={cellRef}
                                    >
                                        {rowIndex === 0 && (
                                            <Text
                                                className={MonthCalendarStyle.dayHeaderText}
                                                text={DOW[colIndex]}
                                            />
                                        )}

                                        <Text
                                            className={[
                                                MonthCalendarStyle.dayNumber,
                                                cell.isOtherMonth && MonthCalendarStyle.otherMonthDayNumber,
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                            text={cell.label}
                                            ref={dayNumberRef}
                                        />
                                        {dayEvents.slice(0, visibleEventsCount).map((event, index) => {
                                            const startDate = new Date(event.startDate);

                                            const durability = getEventBlockWidth(event, currentDate);

                                            const startUtc = Date.UTC(
                                                startDate.getFullYear(),
                                                startDate.getMonth(),
                                                startDate.getDate()
                                            );

                                            const currentUtc = Date.UTC(
                                                currentDate.getFullYear(),
                                                currentDate.getMonth(),
                                                currentDate.getDate()
                                            );

                                            const monday = getMonday(currentDate);

                                            const mondayUtc = Date.UTC(
                                                monday.getFullYear(),
                                                monday.getMonth(),
                                                monday.getDate()
                                            );

                                            const isRealStart = startUtc === currentUtc;

                                            const isWeekContinuation =
                                                startUtc < mondayUtc &&
                                                currentUtc === mondayUtc;


                                            if ((isRealStart || isWeekContinuation) && !cell.isOtherMonth) {
                                                return (
                                                    <div
                                                        key={event.id}
                                                        className={MonthCalendarStyle.dayEventsBlock}
                                                        style={{
                                                            top: `${(rowIndex === 0 ? 55 : 35) + index * 35}px`,
                                                            width: cellSize.width * durability,
                                                        }}
                                                        onClick={(e) => openPopup(event, e.currentTarget, rowIndex, colIndex)}
                                                        ref={monthEventRef}
                                                    >
                                                        <div className={MonthCalendarStyle.monthEvent}>
                                                            <Text
                                                                text={event.title}
                                                                className={MonthCalendarStyle.monthEventText}
                                                            />
                                                        </div>
                                                    </div>

                                                );
                                            }
                                        })}
                                        {hiddenEventsCount > 0 && !cell.isOtherMonth && (
                                            <Button className={MonthCalendarStyle.dayEventButton}
                                                    style={{top: `${buttonTop}px`}}
                                                    ref={moreButtonRef}>
                                                <Text className={MonthCalendarStyle.dayEventButtonText} as={"div"}
                                                      text={`${dayEvents.length - visibleEventsCount} more...`}/>
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )
                })}
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
