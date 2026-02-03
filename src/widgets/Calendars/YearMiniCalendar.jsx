import { useMemo } from "react";
import { Text } from "@shared/Text/Text.jsx";
import { Button } from "@shared/Button/Button.jsx";
import eventsPageStyle from "@app/styles/events.module.css";

import { MONTH_NAMES } from "@features/calendar/constants/calendar.constants";
import { MINI_DAYS_OF_WEEK, MINICALENDAR_TICK_MS } from "@features/calendar/constants/miniCalendar.constants";
import { useNow } from "@features/calendar/hooks/useNow";
import {buildMonthGrid} from "@features/calendar/utils/monthCalendar.utils.js";
import {isSameDay} from "@features/calendar/utils/dateMatch.utils.js";

export function YearMiniCalendar({ year, monthIndex, selected, onSelect }) {
    const weeks = useMemo(() => buildMonthGrid(year, monthIndex), [year, monthIndex]);
    const today = useNow(MINICALENDAR_TICK_MS);

    return (
        <div className={eventsPageStyle.miniCalendarContainer}>
            <Text
                className={eventsPageStyle.miniCalendarTextHeader}
                text={MONTH_NAMES[monthIndex]}
            />

            <div className={eventsPageStyle.miniCalendarMain}>
                <div className={eventsPageStyle.miniCalendarDaysOfWeekSection}>
                    {MINI_DAYS_OF_WEEK.map((d, i) => (
                        <Text
                            key={`${d}-${i}`}
                            className={eventsPageStyle.miniCalendarDayOfWeek}
                            text={d}
                        />
                    ))}
                </div>

                <div className={eventsPageStyle.miniCalendarDaysLayer}>
                    {weeks.map((week, weekIdx) => (
                        <div key={weekIdx} className={eventsPageStyle.miniCalendarWeekSection}>
                            {week.map((cell, idx) => {
                                const isOtherMonth = cell.isOtherMonth;
                                const day = Number(cell.label);

                                const isSelected =
                                    !isOtherMonth &&
                                    !!selected &&
                                    selected.year === year &&
                                    selected.monthIndex === monthIndex &&
                                    selected.day === day;

                                const isToday =
                                    !isOtherMonth &&
                                    isSameDay(new Date(year, monthIndex, day), today);

                                // кружок: выбранное (если есть), иначе "сегодня"
                                const shouldHighlight = isSelected || (!selected && isToday);

                                return (
                                    <Button
                                        key={`${year}-${monthIndex}-${weekIdx}-${idx}`}
                                        onClick={() => {
                                            if (isOtherMonth) return;
                                            onSelect?.({ year, monthIndex, day });
                                        }}
                                        className={[
                                            eventsPageStyle.miniCalendarDayButton,
                                            isOtherMonth && eventsPageStyle.miniCalendarOtherMonth,
                                            shouldHighlight && eventsPageStyle.miniCalendarDaySelected,
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    >
                                        <Text
                                            as="div"
                                            className={[
                                                eventsPageStyle.miniCalendarDayNumber,
                                                isOtherMonth && eventsPageStyle.miniCalendarOtherMonthText,
                                                shouldHighlight && eventsPageStyle.miniCalendarTextDaySelected,
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
        </div>
    );
}
