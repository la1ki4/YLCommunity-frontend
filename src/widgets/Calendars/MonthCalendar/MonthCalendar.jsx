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
import {useEffect, useMemo, useRef, useState} from "react";


export function MonthCalendar({view, onChangeView}) {
    const calendar = useMonthGrid(view.year, view.monthIndex);
    const headerText = `${MONTH_NAMES[view.monthIndex]}, ${view.year}`;

    const startDate = useMemo(() => {
        return new Date(view.year, view.monthIndex, 1);
    }, [view.year, view.monthIndex]);

    const endDate = useMemo(() => {
        return new Date(view.year, view.monthIndex + 1, 0);
    }, [view.year, view.monthIndex]);

    const eventsBetweenDates = useEventsBetweenDates({startDate: startDate, endDate: endDate});


    const [cellWidth, setCellWidth] = useState(0);
    const cellRef = useRef(null);

    useEffect(() => {
        if (!cellRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            const width = entry.borderBoxSize?.[0]?.inlineSize;

            setCellWidth((prev) => {
                if (Math.abs(prev - width) < 1) return prev;
                return width;
            });
        });


        observer.observe(cellRef.current);

        return () => observer.disconnect();
    }, []);

    function getEventBlockWidth(event) {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);

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

        return ((endUtc - startUtc) / (1000 * 60 * 60 * 24) + 1);
    }

    return (
        <section className={MonthCalendarStyle.calendarSection}>
            <div className={MonthCalendarStyle.calendarHeader}>
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
                    <div key={rowIndex} className={MonthCalendarStyle.weekRow}>
                        {week.map((cell, colIndex) => {
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
                                    />
                                </div>
                            );
                        })}
                    </div>
                )})}
            </div>
        </section>
    );
}
