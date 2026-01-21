import { useMemo } from "react";
import eventsPageStyle from "@app/styles/week-calendar.module.css";
import { Button } from "@shared/Button/Button.jsx";
import { Text } from "@shared/Text/Text.jsx";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";

export function WeekCalendarLayout() {
    const days = useMemo(
        () => [
            { label: "Mon", date: 1 },
            { label: "Tue", date: 2, selected: true },
            { label: "Wed", date: 3 },
            { label: "Thu", date: 4 },
            { label: "Fri", date: 5 },
            { label: "Sat", date: 6 },
            { label: "Sun", date: 7 },
        ],
        []
    );

    const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

    return (
        <section className={eventsPageStyle.weekCalendar}>
            <div className={eventsPageStyle.weekHeader}>
                <div className={eventsPageStyle.weekHeaderLeft}>
                    <Text className={eventsPageStyle.weekMonth} text={"January"} />
                    <Text className={eventsPageStyle.weekYear} text={"2026"} />

                    <div className={eventsPageStyle.weekNav}>
                        <Button
                            className={eventsPageStyle.weekNavBtn}
                            children={<Media image={leftIcon}></Media>}
                        >
                        </Button>
                        <Button
                            className={eventsPageStyle.weekNavBtn}
                            children={<Media image={rightIcon}></Media>}
                        >
                        </Button>
                    </div>
                </div>

                <div className={eventsPageStyle.weekHeaderDays}>
                    {days.map((d) => (
                        <div key={`${d.label}-${d.date}`} className={eventsPageStyle.weekHeaderDay}>
                            <Text className={eventsPageStyle.weekDayName} text={d.label} />
                            <div
                                className={[
                                    eventsPageStyle.weekDayNumber,
                                    d.selected ? eventsPageStyle.weekDayNumberSelected : "",
                                ].join(" ")}
                            >
                                <Text className={eventsPageStyle.weekDayNumberText} text={String(d.date)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={eventsPageStyle.weekBody}>
                <div className={eventsPageStyle.weekScroll}>
                    <div className={eventsPageStyle.weekTimes}>
                        {hours.map((h) => (
                            <div key={h} className={eventsPageStyle.weekTimeRow}>
                                <Text className={eventsPageStyle.weekTimeText} text={`${h}:00`} />
                            </div>
                        ))}
                    </div>

                    <div className={eventsPageStyle.weekGrid}>
                        <div className={eventsPageStyle.weekGridInner}>

                            <div className={eventsPageStyle.weekVLines}>
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <div key={i} className={eventsPageStyle.weekVLineCol} />
                                ))}
                            </div>

                            <div className={eventsPageStyle.weekHLines}>
                                {hours.map((h) => (
                                    <div key={h} className={eventsPageStyle.weekHLineRow} />
                                ))}
                            </div>

                            <div className={eventsPageStyle.weekEventExample} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
