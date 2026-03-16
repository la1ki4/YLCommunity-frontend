import {DOW} from "@features/calendar/constants/calendar.constants.js";
import eventsPageStyle from "@app/styles/events.module.css";
import {formatDayTitle} from "@features/calendar/utils/dayCalendar.utils.js";
import {Button} from "@shared/Button/Button.jsx";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";
import {useMemo} from "react";
import {createNavCalendar} from "@features/calendar/utils/navCalendar.js";

export function DayCalendarHeader(props) {
    const { viewDate, onChangeDate } = props;
    const dowIndex = (viewDate.getDay() + 6) % 7;
    const dowText = DOW[dowIndex];
    const dayNum = viewDate.getDate();

    const navCalendar = useMemo(
        () =>
            createNavCalendar({
                setAnchor: (updater) => {
                    const next =
                        typeof updater === "function" ? updater(viewDate) : updater;

                    onChangeDate?.(next);
                },
                setWeekStart: () => {
                },
                onAnchorDateChange: onChangeDate,
            }),
        [viewDate, onChangeDate]
    );

    return (
        <header className={eventsPageStyle.dayHeader}>
            <div className={eventsPageStyle.dayLeft}>
                <div className={eventsPageStyle.badge}>
                    <div>
                        <div className={eventsPageStyle.dow}>{dowText}</div>
                        <div className={eventsPageStyle.pill}>{dayNum}</div>
                    </div>
                </div>
            </div>

            <div className={eventsPageStyle.dayTitle}>
                {formatDayTitle(viewDate)}
            </div>

            <div className={eventsPageStyle.dayRight} aria-label="Navigation">
                <Button
                    className={eventsPageStyle.navBtn}
                    onClick={() => navCalendar(1, "prev")}
                >
                    <Media image={leftIcon}/>
                </Button>
                <Button
                    className={eventsPageStyle.navBtn}
                    onClick={() => navCalendar(1, "next")}
                >
                    <Media image={rightIcon}/>
                </Button>
            </div>
        </header>
    );
}