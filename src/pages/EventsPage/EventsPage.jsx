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
import {useState} from "react";

export default function EventsPage() {
    const [view, setView] = useState("Year");

    return (
        <div className={mainPageStyle.layout}>
            <Header/>
            <Main>
                <div className={eventsPageStyle.mainLayer}>
                    <div className={eventsPageStyle.mainContainer}>
                        <div className={eventsPageStyle.menuLayer}>
                            <CalendarMenu view={view} onChangeView={setView}/>
                            <MiniCalendar/>
                        </div>

                        {view === "Day" && <DayCalendar />}
                        {view === "Week" && <WeekCalendarLayout />}
                        {view === "Month" && <MonthCalendar />}
                        {view === "Year" && <YearCalendar />}
                    </div>
                </div>
            </Main>
        </div>
    );
}