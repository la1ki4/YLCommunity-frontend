import eventsPageStyle from "@app/styles/events.module.css";
import { Text } from "@shared/Text/Text.jsx";
import { Button } from "@shared/Button/Button.jsx";
import { useEffect, useMemo, useState } from "react";
import { Media } from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg?raw";
import rightIcon from "@app/assets/Vector-right.svg?raw";

import { MONTH_NAMES } from "@features/calendar/constants/calendar.constants";
import { MINI_DAYS_OF_WEEK, MINICALENDAR_TICK_MS } from "@features/calendar/constants/miniCalendar.constants";
import { isSameYMD } from "@features/calendar/utils/calendarDate.utils";
import { buildWeeks, shiftMonth } from "@features/calendar/utils/miniCalendar.utils";
import { useNow } from "@features/calendar/hooks/useNow";

export function MiniCalendar({ year, selected, onSelect, forceMonthIndex = null }) {
    const [view, setView] = useState({ year, monthIndex: 0 });

    const today = useNow(MINICALENDAR_TICK_MS);

    useEffect(() => {
        setView((prev) => ({ ...prev, year }));
    }, [year]);

    useEffect(() => {
        if (typeof forceMonthIndex === "number") {
            setView((prev) => ({ ...prev, monthIndex: forceMonthIndex }));
        }
    }, [forceMonthIndex]);

    const weeks = useMemo(
        () => buildWeeks(view.year, view.monthIndex),
        [view.year, view.monthIndex]
    );

    const headerText = `${MONTH_NAMES[view.monthIndex]}, ${view.year}`;

    const goPrev = () => {
        setView((prev) => shiftMonth(prev.year, prev.monthIndex, -1));
    };

    const goNext = () => {
        setView((prev) => shiftMonth(prev.year, prev.monthIndex, +1));
    };

    return (
        <div className={eventsPageStyle.miniCalendarContainer}>
            <div className={eventsPageStyle.miniCalendarHeader}>
                <Text className={eventsPageStyle.miniCalendarTextHeader} text={headerText} />

                <div className={eventsPageStyle.btnBlock}>
                    <Button
                        className={`${eventsPageStyle.miniCalendarNavBtn} ${eventsPageStyle.mr20px}`}
                        onClick={goPrev}
                    >
                        <Media className={eventsPageStyle.imageBtn} image={leftIcon} inlineSvg />
                    </Button>

                    <Button
                        className={eventsPageStyle.miniCalendarNavBtn}
                        onClick={goNext}
                    >
                        <Media className={eventsPageStyle.imageBtn} image={rightIcon} inlineSvg />
                    </Button>
                </div>
            </div>

            <div className={eventsPageStyle.miniCalendarMain}>
                <div className={eventsPageStyle.miniCalendarDaysOfWeekSection}>
                    {MINI_DAYS_OF_WEEK.map((d, i) => (
                        <Text key={`${d}-${i}`} className={eventsPageStyle.miniCalendarDayOfWeek} text={d} />
                    ))}
                </div>

                <div className={eventsPageStyle.miniCalendarDaysLayer}>
                    {weeks.map((week, weekIdx) => (
                        <div key={weekIdx} className={eventsPageStyle.miniCalendarWeekSection}>
                            {week.map((cell, idx) => {
                                const isOtherMonth = cell.isOtherMonth;
                                const dayNum = Number(cell.label);

                                const hasSelectionInThisMonth =
                                    !!selected &&
                                    selected.year === view.year &&
                                    selected.monthIndex === view.monthIndex;

                                const isSelected =
                                    !isOtherMonth &&
                                    hasSelectionInThisMonth &&
                                    selected.day === dayNum;

                                const isToday =
                                    !isOtherMonth &&
                                    isSameYMD(new Date(view.year, view.monthIndex, dayNum), today);

                                const shouldHighlight = isSelected || (!selected && isToday);

                                return (
                                    <Button
                                        key={`${view.year}-${view.monthIndex}-${weekIdx}-${idx}`}
                                        onClick={() => {
                                            if (isOtherMonth) return;
                                            onSelect?.({ year: view.year, monthIndex: view.monthIndex, day: dayNum });
                                        }}
                                        className={[
                                            eventsPageStyle.miniCalendarDayButton,
                                            isOtherMonth && eventsPageStyle.miniCalendarOtherMonth,
                                            shouldHighlight && eventsPageStyle.miniCalendarDaySelected,
                                        ].filter(Boolean).join(" ")}
                                    >
                                        <Text
                                            as="div"
                                            className={[
                                                eventsPageStyle.miniCalendarDayNumber,
                                                isOtherMonth && eventsPageStyle.miniCalendarOtherMonthText,
                                                shouldHighlight && eventsPageStyle.miniCalendarTextDaySelected,
                                            ].filter(Boolean).join(" ")}
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
