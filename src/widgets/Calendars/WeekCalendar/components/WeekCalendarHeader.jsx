import eventsPageStyle from "@app/styles/week-calendar.module.css";
import {Text} from "@shared/Text/Text.jsx";
import {Button} from "@shared/Button/Button.jsx";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";
import {useWeekDays} from "@features/calendar/hooks/useWeekDays.js";
import {DOW, MONTH_NAMES} from "@features/calendar/constants/calendar.constants.js";
import {useMemo} from "react";
import {createNavCalendar} from "@features/calendar/utils/navCalendar.js";
import {isSameDay} from "@features/calendar/utils/dateMatch.utils.js";
import {useNow} from "@features/calendar/hooks/useNow.js";
import {MINICALENDAR_TICK_MS} from "@features/calendar/constants/miniCalendar.constants.js";

export default function WeekCalendarHeader(props) {

    const {
        anchor,
        weekStart,
        selected,
        onAnchorDateChange,
        onSelect,
        monday
    } = props;

    const headerMonth = MONTH_NAMES[anchor.getMonth()];
    const headerYear = String(anchor.getFullYear());

    const days = useWeekDays({
        weekStart,
        selected,
        dowLabels: DOW,
    });

    const today = useNow(MINICALENDAR_TICK_MS);

    const navCalendar = useMemo(
        () =>
            createNavCalendar({
                setAnchor: (updater) => {
                    const next =
                        typeof updater === "function" ? updater(monday) : updater;

                    onAnchorDateChange?.(next);
                    onSelect?.({
                        day: next.getDate(),
                        monthIndex: next.getMonth(),
                        year: next.getFullYear(),
                    });
                },
                setWeekStart: () => {

                },
                onAnchorDateChange,
            }),
        [monday, onAnchorDateChange, onSelect]
    );

    return (
        <header className={eventsPageStyle.weekHeader}>
            <div className={eventsPageStyle.weekHeaderLeft}>
                <Text className={eventsPageStyle.weekMonth} text={headerMonth}/>
                <Text className={eventsPageStyle.weekYear} text={headerYear}/>

                <div className={eventsPageStyle.weekNav}>
                    <Button className={eventsPageStyle.weekNavBtn} onClick={() => navCalendar(7, "prev")}>
                        <Media image={leftIcon}/>
                    </Button>
                    <Button className={eventsPageStyle.weekNavBtn} onClick={() => navCalendar(7, "next")}>
                        <Media image={rightIcon}/>
                    </Button>
                </div>
            </div>

            <div className={eventsPageStyle.weekHeaderDays}>
                {days.map((d) => {
                    const isToday = isSameDay(new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate()), today);
                    return (
                        <div key={d.dateObj.toISOString()} className={eventsPageStyle.weekHeaderDay}>
                            <Text className={eventsPageStyle.weekDayName} text={d.label}/>
                            <div
                                className={[
                                    eventsPageStyle.weekDayNumber,
                                    d.selected ? eventsPageStyle.weekDayNumberSelected : "",
                                    isToday && eventsPageStyle.weekDayNumberToday
                                ].filter(Boolean).join(" ")}
                            >
                                <Text className={eventsPageStyle.weekDayNumberText} text={String(d.date)}/>
                            </div>
                        </div>
                    );
                })}
            </div>
        </header>
    )
}