import { Button } from "@shared/Button/Button.jsx";
import MonthCalendarStyle from "@app/styles/month-calendar.module.css";
import { Text } from "@shared/Text/Text.jsx";
import { Media } from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";

import { DOW, MONTH_NAMES } from "@features/calendar/constants/calendar.constants";
import { shiftMonth } from "@features/calendar/utils/monthCalendar.utils";
import { useMonthGrid } from "@features/calendar/hooks/useMonthGrid";

export function MonthCalendar({ view, onChangeView }) {
    const calendar = useMonthGrid(view.year, view.monthIndex);
    const headerText = `${MONTH_NAMES[view.monthIndex]}, ${view.year}`;

    return (
        <section className={MonthCalendarStyle.calendarSection}>
            <div className={MonthCalendarStyle.calendarHeader}>
                <div>
                    <Text className={MonthCalendarStyle.textHeader} text={headerText} />
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
                        <Media className={MonthCalendarStyle.imageBtn} image={rightIcon} />
                    </Button>
                </div>
            </div>

            <div className={MonthCalendarStyle.calendarGrid}>
                {calendar.map((week, rowIndex) => (
                    <div key={rowIndex} className={MonthCalendarStyle.weekRow}>
                        {week.map((cell, colIndex) => (
                            <div key={`${rowIndex}-${colIndex}`} className={MonthCalendarStyle.dayCell}>
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
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}
