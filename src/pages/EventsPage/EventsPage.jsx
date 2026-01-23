import {Header} from '@widgets/Header/Header.jsx'
import '@app/styles/logo.module.css'
import {Main} from '@widgets/Main/Main.jsx'
import mainPageStyle from '@app/styles/mainPage.module.css'
import eventsPageStyle from '@app/styles/events.module.css'
import {CalendarMenu} from "@widgets/Calendars/CalendarMenu.jsx";
import {MiniCalendar} from "@widgets/Calendars/Minicalendar.jsx";
import {DayCalendar} from "@widgets/Calendars/DayCalendar.jsx";
import {WeekCalendarLayout} from "@widgets/Calendars/WeekCalendar.jsx";
import {MonthCalendar} from "@widgets/Calendars/MonthCalendar.jsx";
import {YearCalendar} from "@widgets/Calendars/YearCalendar.jsx";
import {useRef, useState} from "react";

export default function EventsPage() {
    const [view, setView] = useState("Year");

    const [selected, setSelected] = useState(null);

    const [weekAnchorDate, setWeekAnchorDate] = useState(() => new Date(2026, 0, 1));
    const [dayDate, setDayDate] = useState(() => new Date(2026, 0, 1));
    const [monthView, setMonthView] = useState({ year: 2026, monthIndex: 0 });

    const [miniView, setMiniView] = useState(() => ({
        year: weekAnchorDate.getFullYear(),
        monthIndex: weekAnchorDate.getMonth(),
    }));

    const yearCalApiRef = useRef({
        scrollToMonth: (_monthIndex) => {}
    });

    const onMiniSelect = (value) => {
        setSelected((prev) => {
            if (
                prev &&
                prev.year === value.year &&
                prev.monthIndex === value.monthIndex &&
                prev.day === value.day
            ) return null;
            return value;
        });

        const d = new Date(value.year, value.monthIndex, value.day);

        setWeekAnchorDate(d);
        setDayDate(d);
        setMonthView({ year: value.year, monthIndex: value.monthIndex });
        setMiniView({ year: value.year, monthIndex: value.monthIndex });
        requestAnimationFrame(() => {
            yearCalApiRef.current?.scrollToMonth?.(value.monthIndex);
        });
    };

    const onDayChange = (newDate) => {
        setDayDate(newDate);
        setWeekAnchorDate(newDate);
        setMonthView({ year: newDate.getFullYear(), monthIndex: newDate.getMonth() });
        setMiniView({ year: newDate.getFullYear(), monthIndex: newDate.getMonth() });
        requestAnimationFrame(() => {
            yearCalApiRef.current?.scrollToMonth?.(newDate.getMonth());
        });
    };

    const onMonthChangeView = (updater) => {
        const next = typeof updater === "function" ? updater(monthView) : updater;

        setMonthView(next);
        setMiniView({ year: next.year, monthIndex: next.monthIndex });
        requestAnimationFrame(() => {
            yearCalApiRef.current?.scrollToMonth?.(next.monthIndex);
        });
    };

    const onYearSelect = (value) => {
        setSelected((prev) => {
            if (
                prev &&
                prev.year === value.year &&
                prev.monthIndex === value.monthIndex &&
                prev.day === value.day
            ) return null;
            return value;
        });

        const d = new Date(value.year, value.monthIndex, value.day);

        setWeekAnchorDate(d);
        setDayDate(d);
        setMonthView({ year: value.year, monthIndex: value.monthIndex });
        setMiniView({ year: value.year, monthIndex: value.monthIndex });
        requestAnimationFrame(() => {
            yearCalApiRef.current?.scrollToMonth?.(value.monthIndex);
        });
    };

    return (
        <div className={mainPageStyle.layout}>
            <Header />
            <Main>
                <div className={eventsPageStyle.mainLayer}>
                    <div className={eventsPageStyle.mainContainer}>
                        <div className={eventsPageStyle.menuLayer}>
                            <CalendarMenu view={view} onChangeView={setView} />

                            <MiniCalendar
                                year={miniView.year}
                                selected={selected}
                                onSelect={onMiniSelect}
                                forceMonthIndex={miniView.monthIndex}
                            />
                        </div>

                        {view === "Day" && (
                            <DayCalendar date={dayDate} onChangeDate={onDayChange} />
                        )}

                        {view === "Week" && (
                            <WeekCalendarLayout
                                anchorDate={weekAnchorDate}
                                selected={selected}
                                onAnchorDateChange={(d) => {
                                    setWeekAnchorDate(d);
                                    setMiniView({ year: d.getFullYear(), monthIndex: d.getMonth() });
                                    setMonthView({ year: d.getFullYear(), monthIndex: d.getMonth() });
                                    requestAnimationFrame(() => {
                                        yearCalApiRef.current?.scrollToMonth?.(d.getMonth());
                                    });
                                }}
                            />
                        )}

                        {view === "Month" && (
                            <MonthCalendar view={monthView} onChangeView={onMonthChangeView} />
                        )}

                        {view === "Year" && (
                            <YearCalendar
                                year={miniView.year}
                                setYear={(updater) => {
                                    const nextYear =
                                        typeof updater === "function" ? updater(miniView.year) : updater;

                                    setMiniView((prev) => ({ ...prev, year: nextYear }));
                                    setMonthView((prev) => ({ ...prev, year: nextYear }));
                                }}
                                selected={selected}
                                onSelect={onYearSelect}
                                apiRef={yearCalApiRef}
                            />
                        )}
                    </div>
                </div>
            </Main>
        </div>
    );
}
