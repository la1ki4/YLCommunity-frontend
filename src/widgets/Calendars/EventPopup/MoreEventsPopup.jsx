import Popup from "@widgets/Popup/Popup.jsx";
import {forwardRef} from "react";
import {Text} from "@shared/Text/Text.jsx"
import MoreEventsPopupStyle from "@app/styles/popup.module.css";
import {useMemo} from "react";
import {useEventsBetweenDates} from "@features/get-calendar-events/hooks/useEventsBetweenDates.js";
import {Button} from "@shared/Button/Button.jsx";
import {useOutsideClick} from "@features/calendar/utils/eventPopup.utils.js";

export const MoreEventsPopup = forwardRef(function MoreEventsPopup({
                                                                       isOpen,
                                                                       dayOfWeek,
                                                                       onClose,
                                                                       dayNumber,
                                                                       moreButtonRef,
                                                                       popupStyle,
                                                                       view,
                                                                       onEventClick,
                                                                       moreEventsRef
                                                                   }, ref) {

    const date = useMemo(() => {
        return new Date(
            view.year,
            view.monthIndex,
            dayNumber
        );
    }, [view.year, view.monthIndex, dayNumber]);

    const list = useEventsBetweenDates({
        startDate: date,
        endDate: date,
    });

    useOutsideClick({
        ref: ref,
        ignoreRefs: [moreButtonRef],
        isEnabled: isOpen,
        onOutsideClick: onClose,
    });

    return (
        <Popup isOpen={isOpen} onClose={onClose} style={popupStyle}>
            <div className={MoreEventsPopupStyle.morePopupContent}
                 onClick={(e) => e.stopPropagation()}
                 ref={ref}>
                <Button className={MoreEventsPopupStyle.morePopupCloseButton} onClick={onClose}>×</Button>
                <div
                    className={MoreEventsPopupStyle.morePopupHeader}
                >
                    <Text text={dayOfWeek} className={MoreEventsPopupStyle.morePopupHeaderText} style={{
                        color: "#9dfd40",
                    }}/>
                    <Text
                        text={dayNumber}
                        className={MoreEventsPopupStyle.morePopupHeaderText}
                        style={{
                            color: "#242424",
                            background: "#9dfd40",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    />
                </div>

                <div className={MoreEventsPopupStyle.morePopupEvents}>
                    {list.map((event) => (
                        <div
                            key={event.id}
                            className={MoreEventsPopupStyle.morePopupEvent}
                            onClick={(e) => {
                                e.stopPropagation();

                                onEventClick?.(
                                    event,
                                    e.currentTarget
                                );
                            }}
                            ref={(el) => {
                                moreEventsRef.current[event.id] = el;
                            }}
                        >
                            {event.title}
                        </div>
                    ))}
                </div>
            </div>
        </Popup>
    );
});