import {useEffect, useMemo, useRef} from "react";
import {Text} from "@shared/Text/Text.jsx";
import {Button} from "@shared/Button/Button.jsx";
import YearCalendarStyle from "@app/styles/year-calendar.module.css";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";
import { YearMiniCalendar } from "./YearMiniCalendar.jsx";

export function YearCalendar({ year, setYear, selected, onSelect, apiRef }) {
    const scrollRef = useRef(null);

    const monthRefs = useMemo(
        () => Array.from({ length: 12 }, () => ({ current: null })),
        []
    );
    const scrollToMonth = (monthIndex) => {
        const el = monthRefs[monthIndex]?.current;
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    useEffect(() => {
        if (!apiRef) return;
        apiRef.current = { scrollToMonth };
    }, [apiRef, monthRefs]);

    return (
        <section className={YearCalendarStyle.calendarSection}>
            <div className={YearCalendarStyle.calendarContainer}>
                <div className={YearCalendarStyle.yearHeader}>
                    <div>
                        <Text text={String(year)} className={YearCalendarStyle.textHeader} />
                    </div>

                    <div>
                        <Button
                            className={YearCalendarStyle.navBtn}
                            onClick={() => setYear((y) => y - 1)}
                        >
                            <Media
                                className={`${YearCalendarStyle.imageBtn} ${YearCalendarStyle.mr30px}`}
                                image={leftIcon}
                            />
                        </Button>

                        <Button
                            className={YearCalendarStyle.navBtn}
                            onClick={() => setYear((y) => y + 1)}
                        >
                            <Media className={YearCalendarStyle.imageBtn} image={rightIcon} />
                        </Button>
                    </div>
                </div>

                <div className={YearCalendarStyle.yearScroll} ref={scrollRef}>
                    <div className={YearCalendarStyle.yearGrid}>
                        {Array.from({ length: 12 }, (_, monthIndex) => (
                            <div key={`${year}-${monthIndex}`} ref={monthRefs[monthIndex]}>
                                <YearMiniCalendar
                                    year={year}
                                    monthIndex={monthIndex}
                                    selected={selected}
                                    onSelect={onSelect}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
