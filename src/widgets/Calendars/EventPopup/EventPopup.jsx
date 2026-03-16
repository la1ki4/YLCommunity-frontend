import {useEffect, useMemo, useRef, useState} from "react";
import eventsPageStyle from "@app/styles/events.module.css";
import {InputField} from "@shared/Input/Input.jsx";
import {Media} from "@shared/Image/Media.jsx";
import {Text} from "@shared/Text/Text.jsx";
import {SelectField} from "@shared/Select/Select.jsx";
import CalendarPopup from "@widgets/Popup/CalendarPopup.jsx";
import {EventPopupCalendar} from "@widgets/Calendars/EventPopup/EventPopupCalendar.jsx";
import { useUserFullName } from "@features/get-calendar-user/load/getUserFullname.js";

import timeIcon from "@app/assets/time.svg";
import userIcon from "@app/assets/user.svg";
import mapIcon from "@app/assets/map-pin.svg";
import descriptionIcon from "@app/assets/text-description.svg";

import {handleCreateEvent} from "@features/create-calendar-events/services/createEventHandler";
import {GMT_OPTIONS} from "@features/calendar/constants/calendar.constants.js";
import {
    formatDateToPopupString,
    getNearestDateTime,
    resolveCalendarInput, syncEventRange,
} from "@features/calendar/utils/calendarDate.utils.js";

function getDefaultGMT() {
    const offset = -new Date().getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");

    return `GMT${sign}${hours}`;
}

export function EventPopup({isOpen, onClose}) {
    const initialStartDateTime = getNearestDateTime();
    const initialEndDateTime = getNearestDateTime(1);

    const [startDate, setStartDate] = useState(initialStartDateTime.date);
    const [endDate, setEndDate] = useState(initialEndDateTime.date);
    const [startTime, setStartTime] = useState(initialStartDateTime.time);
    const [endTime, setEndTime] = useState(initialEndDateTime.time);
    const [timeZone, setTimeZone] = useState(getDefaultGMT());
    const [isOpenTimeZone, setIsOpenTimeZone] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [openCalendar, setOpenCalendar] = useState(null);
    const { userFullName } = useUserFullName();

    const calendarRef = useRef(null);
    const popupCalendarRef = useRef(null);
    const timeZoneRef = useRef(null);

    const activeTimeZoneRef = useRef(null);

    const countries = ["Moldova"];
    const [country, setCountry] = useState(countries[0] ?? "");
    const [isOpenCountry, setIsOpenCountry] = useState(false);
    const countryRef = useRef(null);
    const activeCountryRef = useRef(null);

    const parsedStartCalendar = useMemo(
        () => resolveCalendarInput(startDate),
        [startDate]
    );

    const parsedEndCalendar = useMemo(
        () => resolveCalendarInput(endDate),
        [endDate]
    );

    const normalizeCalendarField = (value) => {
        const parsed = resolveCalendarInput(value);

        if (!parsed?.selectedDate) {
            return value;
        }

        return formatDateToPopupString(parsed.selectedDate);
    };

    const normalizeOpenCalendarField = () => {
        if (openCalendar === "start") {
            setStartDate((prev) => normalizeCalendarField(prev));
        }

        if (openCalendar === "end") {
            setEndDate((prev) => normalizeCalendarField(prev));
        }
    };

    useEffect(() => {
        if (isOpenTimeZone && activeTimeZoneRef.current) {
            activeTimeZoneRef.current.scrollIntoView({
                block: "center"
            });
        }
    }, [isOpenTimeZone]);

    useEffect(() => {
        if (isOpenCountry && activeCountryRef.current) {
            activeCountryRef.current.scrollIntoView({
                block: "center",
            });
        }
    }, [isOpenCountry]);

    useEffect(() => {
        function handleClickOutside(event) {
            const clickedInsideInputs =
                calendarRef.current && calendarRef.current.contains(event.target);

            const clickedInsideCalendar =
                popupCalendarRef.current && popupCalendarRef.current.contains(event.target);

            const clickedInsideTimeZone =
                timeZoneRef.current && timeZoneRef.current.contains(event.target);

            const clickedInsideCountry =
                countryRef.current && countryRef.current.contains(event.target);

            if (!clickedInsideInputs && !clickedInsideCalendar) {
                normalizeOpenCalendarField();
                setOpenCalendar(null);
            }

            if (!clickedInsideTimeZone) {
                setIsOpenTimeZone(false);
            }

            if (!clickedInsideCountry) {
                setIsOpenCountry(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openCalendar]);

    const handleStartDateSelect = (dateObj) => {
        const nextStartDate = formatDateToPopupString(dateObj);

        syncAndApplyEventRange({
            startDateValue: nextStartDate,
            endDateValue: endDate,
            startTimeValue: startTime,
            endTimeValue: endTime,
        });
    };

    const handleEndDateSelect = (dateObj) => {
        const nextEndDate = formatDateToPopupString(dateObj);

        syncAndApplyEventRange({
            startDateValue: startDate,
            endDateValue: nextEndDate,
            startTimeValue: startTime,
            endTimeValue: endTime,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await handleCreateEvent({
                title,
                description,
                startDate,
                endDate,
                startTime,
                endTime,
                timeZone,
            });

            onClose();
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const applySyncedEventRange = ({
                                       nextStartDate,
                                       nextEndDate,
                                       nextStartTime,
                                       nextEndTime,
                                   }) => {
        setStartDate(nextStartDate);
        setEndDate(nextEndDate);
        setStartTime(nextStartTime);
        setEndTime(nextEndTime);
    };

    const syncAndApplyEventRange = ({
                                        startDateValue,
                                        endDateValue,
                                        startTimeValue,
                                        endTimeValue,
                                    }) => {
        const result = syncEventRange({
            startDate: startDateValue,
            endDate: endDateValue,
            startTime: startTimeValue,
            endTime: endTimeValue,
        });

        applySyncedEventRange(result);
    };

    return (
        <CalendarPopup isOpen={isOpen} onClose={onClose}>
            <form className={eventsPageStyle.createPopup} onSubmit={handleSubmit}>
                <div className={eventsPageStyle.titleCreateBlock}>
                    <InputField
                        placeholder="Add title"
                        className={eventsPageStyle.titleCreate}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className={eventsPageStyle.createSection}>
                    <Media image={timeIcon}/>

                    <div
                        className={eventsPageStyle.createBlock}
                        style={{marginLeft: "25px"}}
                        ref={calendarRef}
                    >
                        <InputField
                            className={`${eventsPageStyle.createDate} ${eventsPageStyle.fieldBasic} ${eventsPageStyle.d_text}`}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            onFocus={() => setOpenCalendar("start")}
                            onBlur={() => {
                                syncAndApplyEventRange({
                                    startDateValue: startDate,
                                    endDateValue: endDate,
                                    startTimeValue: startTime,
                                    endTimeValue: endTime,
                                });
                            }}
                            style={{padding: "8px"}}
                        />

                        {openCalendar === "start" && (
                            <EventPopupCalendar
                                ref={popupCalendarRef}
                                year={parsedStartCalendar.viewYear}
                                selectedDate={parsedStartCalendar.selectedDate}
                                forceMonthIndex={parsedStartCalendar.viewMonthIndex}
                                onSelect={handleStartDateSelect}
                                style={{top: "45px"}}
                            />
                        )}

                        <InputField
                            className={`${eventsPageStyle.createDate} ${eventsPageStyle.fieldBasic} ${eventsPageStyle.d_text}`}
                            style={{marginTop: "10px", padding: "8px"}}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            onFocus={() => setOpenCalendar("end")}
                            onBlur={() => {
                                syncAndApplyEventRange({
                                    startDateValue: startDate,
                                    endDateValue: endDate,
                                    startTimeValue: startTime,
                                    endTimeValue: endTime,
                                });
                            }}
                        />

                        {openCalendar === "end" && (
                            <EventPopupCalendar
                                ref={popupCalendarRef}
                                year={parsedEndCalendar.viewYear}
                                selectedDate={parsedEndCalendar.selectedDate}
                                forceMonthIndex={parsedEndCalendar.viewMonthIndex}
                                onSelect={handleEndDateSelect}
                                style={{top: "95px"}}
                            />
                        )}
                    </div>

                    <div
                        className={eventsPageStyle.createBlock}
                        style={{marginLeft: "25px"}}
                    >
                        <InputField
                            className={`${eventsPageStyle.createHours} ${eventsPageStyle.fieldBasic} ${eventsPageStyle.d_text}`}
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            onBlur={() => {
                                syncAndApplyEventRange({
                                    startDateValue: startDate,
                                    endDateValue: endDate,
                                    startTimeValue: startTime,
                                    endTimeValue: endTime,
                                });
                            }}
                            style={{padding: "8px"}}
                        />

                        <InputField
                            className={`${eventsPageStyle.createHours} ${eventsPageStyle.fieldBasic} ${eventsPageStyle.d_text}`}
                            style={{marginTop: "10px", padding: "8px"}}
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            onBlur={() => {
                                syncAndApplyEventRange({
                                    startDateValue: startDate,
                                    endDateValue: endDate,
                                    startTimeValue: startTime,
                                    endTimeValue: endTime,
                                });
                            }}
                        />
                    </div>

                    <div
                        className={`${eventsPageStyle.createBlock} ${eventsPageStyle.timeZoneBlock}`}
                        ref={timeZoneRef}
                    >
                        <Text
                            text="Time zone"
                            className={eventsPageStyle.d_text}
                            style={{marginBottom: "5px"}}
                        />
                        <InputField
                            className={`${eventsPageStyle.fieldBasic} ${eventsPageStyle.timeZone} ${eventsPageStyle.d_text}`}
                            value={timeZone}
                            tabIndex={-1}
                            onChange={(e) => setTimeZone(e.target.value)}
                            onFocus={() => setIsOpenTimeZone(true)}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setIsOpenTimeZone(true);
                            }}
                            style={{ cursor: "pointer", padding: "8px"}}
                            readOnly
                        />

                        {isOpenTimeZone && (
                            <div className={eventsPageStyle.timeZoneDropdown}>
                                {GMT_OPTIONS.map((zone) => (
                                    <div
                                        key={zone}
                                        ref={zone === timeZone ? activeTimeZoneRef : null}
                                        className={eventsPageStyle.timeZoneOption}
                                        onMouseDown={() => {
                                            setTimeZone(zone);
                                            setIsOpenTimeZone(false);
                                        }}
                                    >
                                        {zone}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={eventsPageStyle.createSection}>
                    <Media image={userIcon}/>
                    <div
                        className={eventsPageStyle.createOwnerBlock}
                        style={{marginLeft: "25px"}}
                    >
                        <Text
                            className={eventsPageStyle.s_text}
                            text="Owner"
                            style={{color: "rgba(255,255,255,0.25)"}}
                        />
                        <Text
                            className={eventsPageStyle.s_text}
                            text={userFullName}
                            style={{color: "rgba(255,255,255,0.5)"}}
                        />
                    </div>
                </div>

                <div className={eventsPageStyle.createSection}>
                    <Media image={mapIcon}/>
                    <div
                        className={eventsPageStyle.locationWrapper}
                        style={{ marginLeft: "25px"}}
                        ref={countryRef}
                    >
                        <InputField
                            className={`${eventsPageStyle.fieldBasic} ${eventsPageStyle.d_text}`}
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            onFocus={() => setIsOpenCountry(true)}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setIsOpenCountry(true);
                            }}
                            style={{ cursor: "pointer", width: "100%", padding: "8px"}}
                        />

                        {isOpenCountry && (
                            <div className={eventsPageStyle.locationDropdown}>
                                {countries.map((item) => (
                                    <div
                                        key={item}
                                        ref={item === country ? activeCountryRef : null}
                                        className={eventsPageStyle.locationOption}
                                        onMouseDown={() => {
                                            setCountry(item);
                                            setIsOpenCountry(false);
                                        }}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={eventsPageStyle.createSection}>
                    <Media image={descriptionIcon}/>
                    <Text
                        className={eventsPageStyle.d_text}
                        text="Description"
                        style={{marginLeft: "25px"}}
                    />
                </div>

                <textarea
                    className={`${eventsPageStyle.createTextArea} ${eventsPageStyle.s_text}`}
                    placeholder="Enter description . . ."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <button type="submit">Save</button>
            </form>
        </CalendarPopup>
    );
}