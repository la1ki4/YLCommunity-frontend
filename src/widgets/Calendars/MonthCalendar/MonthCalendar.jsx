import {Button} from "@shared/Button/Button.jsx";
import MonthCalendarStyle from "@app/styles/month-calendar.module.css";
import {Text} from "@shared/Text/Text.jsx";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";
import {DOW, MONTH_NAMES} from "@features/calendar/constants/calendar.constants.js";
import {
    calculatePopupLeft,
    calculatePopupTop,
    getEventBlockWidth,
    shiftMonth, sortEventsByDuration
} from "@features/calendar/utils/monthCalendar.utils.js";
import {useMonthGrid} from "@features/calendar/hooks/useMonthGrid.js";
import {useEventsBetweenDates} from "@features/get-calendar-events/hooks/useEventsBetweenDates.js";
import {useMemo, useRef, useState} from "react";
import {formatDateKey, getMonday} from "@features/calendar/utils/calendarDate.utils.js";
import {CalendarInfoPopup} from "@widgets/Calendars/CalendarInfoPopup/CalendarInfoPopup.jsx";
import {MoreEventsPopup} from "@widgets/Calendars/EventPopup/MoreEventsPopup.jsx";
import {useClosePopupOnZoom} from "@features/calendar/hooks/useClosePopupOnZoom.js";
import {useCalculateEventPopupPositionForMonthCalendar} from "@features/calendar/hooks/useCalculateEventPopupPosition.js";
import {createEventPopupHandlers} from "@features/calendar/utils/eventPopup.utils.js";
import {useCalculateMonthCellSize} from "@features/calendar/hooks/useCalculateMontCellSize.js";
import {useCalculateMonthEventSize} from "@features/calendar/hooks/useCalculateMonthEventSize.js";
import {INITIAL_CELL_SIZE, INITIAL_ELEMENT_SIZES} from "@features/calendar/constants/monthCalendar.constants.js";

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
            const key = formatDateKey(currentDate);

            if (!acc[key]) {
                acc[key] = [];
            }

            acc[key].push(event);

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return acc;
    }, {});

    const [cellSize, setCellSize] = useState(INITIAL_CELL_SIZE);
    const cellRef = useRef(null);

    useCalculateMonthCellSize({
        cellRef,
        setCellSize,
    });

    const dayNumberRef = useRef(null);
    const moreButtonRefs = useRef([]);
    const [elementSizes, setElementSizes] = useState(INITIAL_ELEMENT_SIZES);

    const measureButtonRef = useRef(null);

    useCalculateMonthEventSize({
        cellHeight: cellSize.height,
        dayNumberRef,
        measureButtonRef,
        setElementSizes,
    });


    const [selectedEvent, setSelectedEvent] = useState(null);
    const selectedEventRef = useRef(null);
    const selectedRowIndexRef = useRef(null);
    const selectedColIndexRef = useRef(null);
    const [popupPositionVersion, setPopupPositionVersion] = useState(0);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const {
        openPopup,
        closePopup,
    } = createEventPopupHandlers({
        setIsPopupVisible,
        setSelectedEvent,
        setPopupPositionVersion,

        selectedEventRef,
        selectedRowIndexRef,
        selectedColIndexRef,
    });

    const [selectedMoreButton, setSelectedMoreButton] = useState(false);
    const [selectedMorePopupData, setSelectedMorePopupData] = useState(null);
    const openMoreButton = (dayOfWeek, dayNumber) => {

        setSelectedMorePopupData({
            dayOfWeek,
            dayNumber,
        });

        setSelectedMoreButton(true);
    }

    const closeMoreButton = () => {
        setSelectedMoreButton(false);
    };

    const popupRef = useRef(null);
    const calendarHeaderRef = useRef(null);
    const calendarSectionRef = useRef(null);
    const calendarRowRef = useRef(null);
    const [popupTop, setPopupTop] = useState(0);
    const [popupLeft, setPopupLeft] = useState(0);

    useClosePopupOnZoom({
        isEnabled: isPopupVisible,
        onClose: closePopup,
    });


    useCalculateEventPopupPositionForMonthCalendar({
        selectedEvent,
        isPopupVisible,
        popupPositionVersion,

        popupRef,

        calendarHeaderRef,
        calendarSectionRef,
        calendarRowRef,
        cellRef,

        selectedEventRef,
        selectedRowIndexRef,
        selectedColIndexRef,

        calculatePopupLeft,
        calculatePopupTop,

        setPopupLeft,
        setPopupTop,
    });

    const eventRefs = useRef({});
    const morePopupRef = useRef(null);

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
                                const key = formatDateKey(currentDate);
                                const dayEvents = sortEventsByDuration(
                                        monthEventsGroup[key] || []
                                    );

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
                                                        ref={(el) => {
                                                            const key = `${rowIndex}-${colIndex}-${event.id}`;

                                                            if (el) {
                                                                eventRefs.current[key] = el;
                                                            } else {
                                                                delete eventRefs.current[key];
                                                            }
                                                        }}
                                                        onClick={(e) =>
                                                            openPopup(
                                                                event,
                                                                e.currentTarget,
                                                                rowIndex,
                                                                colIndex
                                                            )
                                                        }
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
                                                    ref={(el) => {
                                                        if (!measureButtonRef.current && el) {
                                                            measureButtonRef.current = el;
                                                        }

                                                        moreButtonRefs.current[`${rowIndex}-${colIndex}`] = el;
                                                    }}
                                                    onClick={() =>
                                                        openMoreButton(
                                                            DOW[colIndex],
                                                            cell.label
                                                        )
                                                    }
                                            >
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
                    eventRefs={eventRefs}
                    style={{
                        top: `${popupTop}px`,
                        left: `${popupLeft}px`,
                    }}
                />
            )}
            {selectedMoreButton && (
                <MoreEventsPopup
                    isOpen={selectedMoreButton}
                    onClose={closeMoreButton}
                    moreButtonRef={moreButtonRefs}
                    dayOfWeek={selectedMorePopupData?.dayOfWeek}
                    dayNumber={selectedMorePopupData?.dayNumber}
                    view={view}
                    ref={morePopupRef}
                />
            )}
        </section>
    );
}
