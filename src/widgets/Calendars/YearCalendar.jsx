import {Text} from "@shared/Text/Text.jsx";
import {Button} from "@shared/Button/Button.jsx";
import YearCalendarStyle from "@app/styles/year-calendar.module.css";
import {Media} from "@shared/Image/Media.jsx";
import leftIcon from "@app/assets/Vector-left.svg";
import rightIcon from "@app/assets/Vector-right.svg";
import { YearMiniCalendar } from "./YearMiniCalendar.jsx";


export function YearCalendar() {

    return (
        <section className={YearCalendarStyle.calendarSection}>
            <div className={YearCalendarStyle.calendarContainer}>
                <div className={YearCalendarStyle.yearHeader}>
                    <div>
                        <Text text={"2026"} className={YearCalendarStyle.textHeader}></Text>
                    </div>
                    <div>
                        <Button
                            className={YearCalendarStyle.navBtn}
                            children={<Media className={`${YearCalendarStyle.imageBtn} ${YearCalendarStyle.mr30px}`} image={leftIcon}></Media>}
                        >
                        </Button>
                        <Button
                            className={YearCalendarStyle.navBtn}
                            children={<Media className={YearCalendarStyle.imageBtn} image={rightIcon}></Media>}
                        >
                        </Button>
                    </div>
                </div>
                <div className={YearCalendarStyle.yearScroll}>
                    <div className={YearCalendarStyle.yearGrid}>
                        {Array.from({ length: 12 }, (_, monthIndex) => (
                            <YearMiniCalendar
                                key={monthIndex}
                                year={2026}
                                monthIndex={monthIndex}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}