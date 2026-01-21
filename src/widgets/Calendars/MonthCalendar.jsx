import {Button} from "@shared/Button/Button.jsx";
import MonthCalendarStyle from "@app/styles/month-calendar.module.css"
import {Text} from "@shared/Text/Text.jsx";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";
import {useMemo} from "react";

export function MonthCalendar() {

    const calendar = useMemo(
        () => [
            ["-", "-", "-", "1", "2", "3", "4"],
            ["5", "6", "7", "8", "9", "10", "11"],
            ["12", "13", "14", "15", "16", "17", "18"],
            ["19", "20", "21", "22", "23", "24", "25"],
            ["26", "27", "28", "29", "30", "31", "-"],
        ],
        []
    );

    const daysOfWeek = useMemo(() => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], []);

    return (
        <section className={MonthCalendarStyle.calendarSection}>
            <div className={MonthCalendarStyle.calendarHeader}>
                <div>
                    <Text className={MonthCalendarStyle.textHeader} text={"January, 2026"}></Text>
                </div>
                <div className={MonthCalendarStyle.btnBlock}>
                    <Button
                        className={MonthCalendarStyle.navBtn}
                        children={<Media className={`${MonthCalendarStyle.imageBtn} ${MonthCalendarStyle.mr30px}`} image={leftIcon}></Media>}
                    >
                    </Button>
                    <Button
                        className={MonthCalendarStyle.navBtn}
                        children={<Media className={MonthCalendarStyle.imageBtn} image={rightIcon}></Media>}
                    >
                    </Button>
                </div>
            </div>
            <div className={MonthCalendarStyle.calendarGrid}>
                {calendar.map((week, rowIndex) => (
                    <div key={rowIndex} className={MonthCalendarStyle.weekRow}>
                        {week.map((day, colIndex) => (
                            <div key={`${rowIndex}-${colIndex}`} className={MonthCalendarStyle.dayCell}>
                                {rowIndex === 0 && (
                                    <Text
                                        className={MonthCalendarStyle.dayHeaderText}
                                        text={daysOfWeek[colIndex]}
                                    />
                                )}

                                {day !== "-" && (
                                    <Text className={MonthCalendarStyle.dayNumber} text={day} />
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    )
}