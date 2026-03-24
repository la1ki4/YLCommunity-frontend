import { useEffect, useRef, useState } from "react";
import eventsPageStyle from "@app/styles/events.module.css";
import { Button } from "@shared/Button/Button.jsx";
import { Media } from "@shared/Image/Media.jsx";
import downIcon from "@app/assets/Vector.svg";
import createButtonLeftIcon from "@app/assets/plus-circle.svg";
import { Text } from "@shared/Text/Text.jsx";
import { EventPopup } from "@widgets/Calendars/EventPopup/EventPopup.jsx";

const CALENDAR_OPTIONS = ["Day", "Week", "Month", "Year"];
const EVENT_OPTIONS = ["Event"];

export function CalendarMenu({ view, onChangeView }) {
    const [openCalendar, setOpenCalendar] = useState(false);
    const [openCreateMenu, setOpenCreateMenu] = useState(false);
    const [isEventPopupOpen, setIsEventPopupOpen] = useState(false);

    const calendarWrapperRef = useRef(null);
    const createWrapperRef = useRef(null);

    useEffect(() => {
        const onClick = (e) => {
            if (
                calendarWrapperRef.current &&
                !calendarWrapperRef.current.contains(e.target) &&
                createWrapperRef.current &&
                !createWrapperRef.current.contains(e.target)
            ) {
                setOpenCalendar(false);
                setOpenCreateMenu(false);
            }
        };

        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const toggleCreateMenu = () => {
        setOpenCreateMenu((v) => !v);
        setOpenCalendar(false);
    };

    const toggleCalendarMenu = () => {
        setOpenCalendar((v) => !v);
        setOpenCreateMenu(false);
    };

    const select = (v) => {
        onChangeView(v);
        setOpenCalendar(false);
    };

    return (
        <div className={eventsPageStyle.menuButtons}>
            <div
                className={eventsPageStyle.buttonBlock}
                ref={createWrapperRef}
                style={{ position: "relative" }}
            >
                <Button
                    className={`${eventsPageStyle.btn} ${eventsPageStyle.button}`}
                    rightIcon={<Media className={eventsPageStyle.iconButton} image={downIcon} />}
                    leftIcon={<Media className={eventsPageStyle.iconButton} image={createButtonLeftIcon} />}
                    onClick={toggleCreateMenu}
                >
                    Create
                </Button>

                {openCreateMenu && (
                    <div className={eventsPageStyle.dropdown}>
                        {EVENT_OPTIONS.map((opt) => (
                            <button
                                key={opt}
                                className={eventsPageStyle.dropdownItem}
                                onClick={() => {
                                    setOpenCreateMenu(false);
                                    setIsEventPopupOpen(true);
                                }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div
                className={eventsPageStyle.buttonBlock}
                ref={calendarWrapperRef}
                style={{ position: "relative" }}
            >
                <Button
                    className={`${eventsPageStyle.btn} ${eventsPageStyle.button}`}
                    rightIcon={<Media className={eventsPageStyle.iconButton} image={downIcon} />}
                    onClick={toggleCalendarMenu}
                >
                    <Text className={eventsPageStyle.textBlock} text={view} />
                </Button>

                {openCalendar && (
                    <div className={eventsPageStyle.dropdown}>
                        {CALENDAR_OPTIONS.map((opt) => {
                            const active = opt === view;
                            return (
                                <button
                                    key={opt}
                                    onClick={() => select(opt)}
                                    className={[
                                        eventsPageStyle.dropdownItem,
                                        active && eventsPageStyle.downItemActive,
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <EventPopup
                isOpen={isEventPopupOpen}
                onClose={() => setIsEventPopupOpen(false)}
            />
        </div>
    );
}
