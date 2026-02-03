import { Header } from "@widgets/Header/Header.jsx";
import "@app/styles/logo.module.css";
import { Main } from "@widgets/Main/Main.jsx";
import mainPageStyle from "@app/styles/mainPage.module.css";
import eventsPageStyle from "@app/styles/events.module.css";

import { CalendarMenu } from "@widgets/Calendars/CalendarMenu.jsx";
import { MiniCalendar } from "@widgets/Calendars/Minicalendar.jsx";
import { DayCalendar } from "@widgets/Calendars/DayCalendar.jsx";
import { WeekCalendarLayout } from "@widgets/Calendars/WeekCalendar.jsx";
import { MonthCalendar } from "@widgets/Calendars/MonthCalendar.jsx";
import { YearCalendar } from "@widgets/Calendars/YearCalendar.jsx";

import { useEventsPageCalendarController } from "@features/calendar/hooks/useEventsPageCalendarController";

export default function EventsPage() {
    const {
        view,
        setView,
        selected,

        weekAnchorDate,
        dayDate,
        monthView,

        onSelect,
        onDayChangeView,
        onMonthChangeView,
        onWeekChangeView,
        onYearChangeView,

        yearCalApiRef,
    } = useEventsPageCalendarController();

    return (
        <div className={mainPageStyle.layout}>
            <Header />
            <Main>
                <div className={eventsPageStyle.mainLayer}>
                    <div className={eventsPageStyle.mainContainer}>
                        <div className={eventsPageStyle.menuLayer}>
                            <CalendarMenu view={view} onChangeView={setView} />

                            <MiniCalendar
                                year={monthView.year}
                                selected={selected}
                                onSelect={onSelect}
                                forceMonthIndex={monthView.monthIndex}
                            />
                        </div>

                        {view === "Day" && <DayCalendar date={dayDate} onChangeDate={onDayChangeView} />}

                        {view === "Week" && (
                            <WeekCalendarLayout
                                anchorDate={weekAnchorDate}
                                selected={selected}
                                onAnchorDateChange={onWeekChangeView}
                            />
                        )}

                        {view === "Month" && (
                            <MonthCalendar view={monthView} onChangeView={onMonthChangeView} />
                        )}

                        {view === "Year" && (
                            <YearCalendar
                                year={monthView.year}
                                onYearChangeView={onYearChangeView}
                                selected={selected}
                                onSelect={onSelect}
                                apiRef={yearCalApiRef}
                            />
                        )}
                    </div>
                </div>
            </Main>
        </div>
    );
}
