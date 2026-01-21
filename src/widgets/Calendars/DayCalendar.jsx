import eventsPageStyle from "@app/styles/events.module.css";
import {Button} from "@shared/Button/Button.jsx";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";

export function DayCalendar() {
    return (
        <section className={eventsPageStyle.day} aria-label="Day calendar">
            <header className={eventsPageStyle.dayHeader}>
                <div className={eventsPageStyle.dayLeft}>
                    <div className={eventsPageStyle.badge}>
                        <div>
                            <div className={eventsPageStyle.dow}>Tue</div>
                            <div className={eventsPageStyle.pill}>2</div>
                        </div>
                    </div>
                </div>
                <div className={eventsPageStyle.dayTitle}>
                    January 2, 2026
                </div>
                <div className={eventsPageStyle.dayRight} aria-label="Navigation">
                    <Button
                        className={eventsPageStyle.navBtn}
                        children={<Media image={leftIcon}></Media>}
                    >
                    </Button>
                    <Button
                        className={eventsPageStyle.navBtn}
                        children={<Media image={rightIcon}></Media>}
                    >
                    </Button>
                </div>
            </header>
            <div className={eventsPageStyle.dayBody}>
                <div className={eventsPageStyle.timeline}>
                    <div
                        className={eventsPageStyle.timeCol}
                        aria-hidden="true">
                        {[
                            "1:00", "2:00", "3:00", "4:00", "5:00", "6:00",
                            "7:00", "8:00", "9:00", "10:00", "11:00", "12:00",
                            "13:00", "14:00", "15:00", "16:00", "17:00",
                            "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
                        ].map(time => (
                            <div
                                key={time}
                                className={eventsPageStyle.time}
                            >
                                {time}
                            </div>
                        ))}
                    </div>

                    <div className={eventsPageStyle.gridCol}>
                        {Array.from({length: 24}).map((_, i) => (
                            <div
                                key={i}
                                className={eventsPageStyle.row}
                            />
                        ))}
                        <div className={eventsPageStyle.now} title="Now"/>
                    </div>
                </div>
            </div>
        </section>
    )
}