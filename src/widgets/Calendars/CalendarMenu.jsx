import { useEffect, useRef, useState } from "react";
import eventsPageStyle from "@app/styles/events.module.css";
import { Button } from "@shared/Button/Button.jsx";
import { Media } from "@shared/Image/Media.jsx";
import downIcon from "@app/assets/Vector.svg";
import createButtonLeftIcon from "@app/assets/plus-circle.svg";
import { Text } from "@shared/Text/Text.jsx";

const OPTIONS = ["Day", "Week", "Month", "Year"];

export function CalendarMenu({ view = "Year", onChangeView }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    // закрытие по клику вне
    useEffect(() => {
        const onClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    // закрытие по Esc
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    const select = (v) => {
        onChangeView(v);
        setOpen(false);
    };

    return (
        <div className={eventsPageStyle.menuButtons}>
            <div className={eventsPageStyle.buttonBlock}>
                <Button
                    className={`${eventsPageStyle.btn} ${eventsPageStyle.button}`}
                    rightIcon={<Media className={eventsPageStyle.iconButton} image={downIcon} />}
                    leftIcon={<Media className={eventsPageStyle.iconButton} image={createButtonLeftIcon} />}
                >
                    Create
                </Button>
            </div>

            {/* ▼ WRAPPER важен для позиционирования */}
            <div
                className={eventsPageStyle.buttonBlock}
                ref={wrapperRef}
                style={{ position: "relative" }}
            >
                <Button
                    className={`${eventsPageStyle.btn} ${eventsPageStyle.button}`}
                    rightIcon={<Media className={eventsPageStyle.iconButton} image={downIcon} />}
                    onClick={() => setOpen((v) => !v)}
                >
                    <Text className={eventsPageStyle.textBlock} text={view} />
                </Button>

                {open && (
                    <div className={eventsPageStyle.dropdown}>
                        {OPTIONS.map((opt) => {
                            const active = opt === view;
                            return (
                                <button
                                    key={opt}
                                    onClick={() => select(opt)}
                                    className={[
                                        eventsPageStyle.dropdownItem,
                                        active && eventsPageStyle.dropdownItemActive,
                                    ].filter(Boolean).join(" ")}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
