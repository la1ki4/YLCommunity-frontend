import { useMemo, useState } from "react";
import { Text } from "@shared/Text/Text.jsx";
import { Button } from "@shared/Button/Button.jsx";
import eventsPageStyle from "@app/styles/events.module.css";

const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];

function buildWeeks(year, monthIndex) {
    const first = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const prevMonthDays = new Date(year, monthIndex, 0).getDate();

    const startOffset = (first.getDay() + 6) % 7;

    const cells = [];

    for (let i = startOffset - 1; i >= 0; i--) {
        const d = prevMonthDays - i;
        cells.push({ label: String(d), isOtherMonth: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ label: String(d), isOtherMonth: false });
    }

    let nextDay = 1;
    while (cells.length < 42) {
        cells.push({ label: String(nextDay), isOtherMonth: true });
        nextDay++;
    }

    const weeks = [];
    for (let i = 0; i < 42; i += 7) {
        weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
}

const MONTH_NAMES = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

export function YearMiniCalendar({ year, monthIndex }) {
    const [selectedDay, setSelectedDay] = useState(null);

    const weeks = useMemo(
        () => buildWeeks(year, monthIndex),
        [year, monthIndex]
    );

    return (
        <div className={eventsPageStyle.miniCalendarContainer}>
            <Text
                className={eventsPageStyle.miniCalendarTextHeader}
                text={MONTH_NAMES[monthIndex]}
            />

            <div className={eventsPageStyle.miniCalendarMain}>
                <div className={eventsPageStyle.miniCalendarDaysOfWeekSection}>
                    {DAYS_OF_WEEK.map((d, i) => (
                        <Text
                            key={`${d}-${i}`}
                            className={eventsPageStyle.miniCalendarDayOfWeek}
                            text={d}
                        />
                    ))}
                </div>

                <div className={eventsPageStyle.miniCalendarDaysLayer}>
                    {weeks.map((week, weekIdx) => (
                        <div
                            key={weekIdx}
                            className={eventsPageStyle.miniCalendarWeekSection}
                        >
                            {week.map((cell, idx) => {
                                const isOtherMonth = cell.isOtherMonth;
                                const day = cell.label;
                                const isSelected = selectedDay === day && !isOtherMonth;

                                return (
                                    <Button
                                        key={`${day}-${weekIdx}-${idx}`}
                                        onClick={() => !isOtherMonth && setSelectedDay((prev) => (prev === day ? null : day))}
                                        className={[
                                            eventsPageStyle.miniCalendarDayButton,
                                            isOtherMonth && eventsPageStyle.miniCalendarOtherMonth,
                                            isSelected && eventsPageStyle.miniCalendarDaySelected,
                                        ].filter(Boolean).join(" ")}
                                    >
                                        <Text
                                            as="div"
                                            className={[
                                                eventsPageStyle.miniCalendarDayNumber,
                                                isOtherMonth && eventsPageStyle.miniCalendarOtherMonthText,
                                                isSelected && eventsPageStyle.miniCalendarTextDaySelected,
                                            ].filter(Boolean).join(" ")}
                                            text={day}
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