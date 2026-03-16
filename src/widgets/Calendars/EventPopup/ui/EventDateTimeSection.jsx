import eventsPageStyle from "@app/styles/events.module.css";
import {InputField} from "@shared/Input/Input.jsx";
import {Media} from "@shared/Image/Media.jsx";
import {EventPopupCalendar} from "@widgets/Calendars/EventPopup/EventPopupCalendar.jsx";
import timeIcon from "@app/assets/time.svg";

export function EventDateTimeSection({values, setters, refs, handlers}) {
    const {
        startDate,
        endDate,
        startTime,
        endTime,
        openCalendar,
        parsedStartCalendar,
        parsedEndCalendar,
    } = values;

    const {setStartDate, setEndDate, setStartTime, setEndTime, setOpenCalendar} = setters;
    const {calendarRef, popupCalendarRef} = refs;
    const {syncAndApplyEventRange, handleStartDateSelect, handleEndDateSelect} = handlers;

    const syncCurrentRange = () => {
        syncAndApplyEventRange({
            startDateValue: startDate,
            endDateValue: endDate,
            startTimeValue: startTime,
            endTimeValue: endTime,
        });
    };

    return (
        <div className={eventsPageStyle.createSection}>
            <Media image={timeIcon}/>

            <div className={eventsPageStyle.createBlock} style={{marginLeft: "25px"}} ref={calendarRef}>
                <InputField
                    className={`${eventsPageStyle.createDate} ${eventsPageStyle.fieldBasic} ${eventsPageStyle.d_text}`}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onFocus={() => setOpenCalendar("start")}
                    onBlur={syncCurrentRange}
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
                    onBlur={syncCurrentRange}
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

            <div className={eventsPageStyle.createBlock} style={{marginLeft: "25px"}}>
                <InputField
                    className={`${eventsPageStyle.createHours} ${eventsPageStyle.fieldBasic} ${eventsPageStyle.d_text}`}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    onBlur={syncCurrentRange}
                    style={{padding: "8px"}}
                />

                <InputField
                    className={`${eventsPageStyle.createHours} ${eventsPageStyle.fieldBasic} ${eventsPageStyle.d_text}`}
                    style={{marginTop: "10px", padding: "8px"}}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    onBlur={syncCurrentRange}
                />
            </div>
        </div>
    );
}
