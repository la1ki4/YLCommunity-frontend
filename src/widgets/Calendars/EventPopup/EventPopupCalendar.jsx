import { forwardRef, useEffect, useMemo, useState } from "react";
import { Button } from "@shared/Button/Button.jsx";
import { Text } from "@shared/Text/Text.jsx";
import { MINI_DAYS_OF_WEEK, MINICALENDAR_TICK_MS } from "@features/calendar/constants/miniCalendar.constants";
import calendarPopupStyles from "@app/styles/popup.module.css";
import { isSameDay } from "@features/calendar/utils/dateMatch.utils.js";
import { buildMonthGrid, shiftMonth } from "@features/calendar/utils/monthCalendar.utils.js";
import { useNow } from "@features/calendar/hooks/useNow.js";
import { MONTH_NAMES } from "@features/calendar/constants/calendar.constants.js";
import { Media } from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg?raw";
import rightIcon from "@app/assets/Vector-right.svg?raw";

export const EventPopupCalendar = forwardRef(function EventPopupCalendar(
    { year, selectedDate, onSelect, forceMonthIndex, ...divProps },
    ref
) {
    const [view, setView] = useState({ year, monthIndex: forceMonthIndex });

    useEffect(() => {
        setView({ year, monthIndex: forceMonthIndex });
    }, [year, forceMonthIndex]);

    const weeks = useMemo(
        () => buildMonthGrid(view.year, view.monthIndex),
        [view.year, view.monthIndex]
    );

    const headerText = `${MONTH_NAMES[view.monthIndex]}, ${view.year}`;
    const today = useNow(MINICALENDAR_TICK_MS);

    const goPrev = () => {
        setView((prev) => shiftMonth(prev.year, prev.monthIndex, -1));
    };

    const goNext = () => {
        setView((prev) => shiftMonth(prev.year, prev.monthIndex, +1));
    };

    return (
        <div
            ref={ref}
            className={calendarPopupStyles.calendar}
            {...divProps}
        >
            <div className={calendarPopupStyles.header}>
                <Text className={calendarPopupStyles.headerText} text={headerText} />
                <div>
                    <Button onClick={goPrev} className={calendarPopupStyles.btnBlock}>
                        <Media className={calendarPopupStyles.imageBtn} image={leftIcon} inlineSvg />
                    </Button>
                    <Button
                        onClick={goNext}
                        className={calendarPopupStyles.btnBlock}
                        style={{ marginLeft: "15px" }}
                    >
                        <Media className={calendarPopupStyles.imageBtn} image={rightIcon} inlineSvg />
                    </Button>
                </div>
            </div>

            <div className={calendarPopupStyles.calendarWeekDaysBlock}>
                {MINI_DAYS_OF_WEEK.map((d, i) => (
                    <Text
                        className={calendarPopupStyles.weekDaysText}
                        key={`${d}-${i}`}
                        text={d}
                    />
                ))}
            </div>

            <div className={calendarPopupStyles.calendarDaysBlock}>
                {weeks.map((week, weekIdx) => (
                    <div
                        key={weekIdx}
                        className={calendarPopupStyles.calendarWeekSection}
                    >
                        {week.map((cell, idx) => {
                            const isOtherMonth = cell.isOtherMonth;
                            const dayNum = Number(cell.label);
                            const date = new Date(view.year, view.monthIndex, dayNum);

                            const shouldHighlight =
                                !isOtherMonth &&
                                (
                                    (selectedDate && isSameDay(date, selectedDate)) ||
                                    (!selectedDate && isSameDay(date, today))
                                );

                            return (
                                <Button
                                    key={`${view.year}-${view.monthIndex}-${weekIdx}-${idx}`}
                                    onClick={() => {
                                        if (isOtherMonth) return;
                                        onSelect?.(date);
                                    }}
                                    className={[
                                        calendarPopupStyles.calendarDaysButton,
                                        isOtherMonth && calendarPopupStyles.calendarOpacity,
                                        shouldHighlight && calendarPopupStyles.calendarDaySelected,
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                >
                                    <Text
                                        as="div"
                                        className={[
                                            calendarPopupStyles.calendarDayNumber,
                                            isOtherMonth && calendarPopupStyles.calendarOtherMonthText,
                                            shouldHighlight && calendarPopupStyles.calendarTextDaySelected,
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                        text={cell.label}
                                    />
                                </Button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
});