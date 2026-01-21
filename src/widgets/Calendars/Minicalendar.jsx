import eventsPageStyle from "@app/styles/events.module.css";
import { Text } from "@shared/Text/Text.jsx";
import { Button } from "@shared/Button/Button.jsx";
import { useState, useMemo } from "react";

export function MiniCalendar() {
    const [selectedDay, setSelectedDay] = useState(null);

    const weeks = useMemo(
        () => [
            ["-", "-", "-", "1", "2", "3", "4"],
            ["5", "6", "7", "8", "9", "10", "11"],
            ["12", "13", "14", "15", "16", "17", "18"],
            ["19", "20", "21", "22", "23", "24", "25"],
            ["26", "27", "28", "29", "30", "31", "-"],
        ],
        []
    );

    const daysOfWeek = useMemo(() => ["M", "T", "W", "T", "F", "S", "S"], []);

    return (
        <div className={eventsPageStyle.miniCalendarContainer}>
            <Text className={eventsPageStyle.miniCalendarTextHeader} text={"January, 2026"} />

            <div className={eventsPageStyle.miniCalendarMain}>
                <div className={eventsPageStyle.miniCalendarDaysOfWeekSection}>
                    {daysOfWeek.map((d, i) => (
                        <Text key={`${d}-${i}`} className={eventsPageStyle.miniCalendarDayOfWeek} text={d} />
                    ))}
                </div>

                <div className={eventsPageStyle.miniCalendarDaysLayer}>
                    {weeks.map((week, weekIdx) => (
                        <div key={weekIdx} className={eventsPageStyle.miniCalendarWeekSection}>
                            {week.map((day, idx) => {
                                const isEmpty = day === "-";
                                const isSelected = selectedDay === day;

                                return (
                                    <Button
                                        key={`${day}-${weekIdx}-${idx}`}
                                        disabled={isEmpty}
                                        onClick={() => !isEmpty && setSelectedDay((prev) => (prev === day ? null : day))}
                                        className={[
                                            !isEmpty && eventsPageStyle.miniCalendarDayButton,
                                            isEmpty && eventsPageStyle.miniCalendarEmptyDay,
                                            isSelected && eventsPageStyle.miniCalendarDaySelected,
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    >
                                        <Text
                                            as="div"
                                            className={[
                                                eventsPageStyle.miniCalendarDayNumber,
                                                isSelected && eventsPageStyle.miniCalendarTextDaySelected,
                                            ].filter(Boolean).join(" ")}
                                            text={isEmpty ? "" : day}
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
