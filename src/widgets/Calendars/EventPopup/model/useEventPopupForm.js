import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {handleCreateEvent} from "@features/create-calendar-events/services/createEventHandler";
import {GMT_OPTIONS} from "@features/calendar/constants/calendar.constants.js";
import {
    formatDateToPopupString,
    getNearestDateTime,
    resolveCalendarInput,
    syncEventRange,
} from "@features/calendar/utils/calendarDate.utils.js";
import {useOutsideClose} from "@widgets/Calendars/EventPopup/model/useOutsideClose.js";

function getDefaultGMT() {
    const offset = -new Date().getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");

    return `GMT${sign}${hours}`;
}

export function useEventPopupForm({onClose}) {
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

    const calendarRef = useRef(null);
    const popupCalendarRef = useRef(null);
    const timeZoneRef = useRef(null);

    const activeTimeZoneRef = useRef(null);

    const countries = ["Moldova"];
    const [country, setCountry] = useState(countries[0] ?? "");
    const [isOpenCountry, setIsOpenCountry] = useState(false);
    const countryRef = useRef(null);
    const activeCountryRef = useRef(null);

    const parsedStartCalendar = useMemo(() => resolveCalendarInput(startDate), [startDate]);
    const parsedEndCalendar = useMemo(() => resolveCalendarInput(endDate), [endDate]);

    const applySyncedEventRange = useCallback(({nextStartDate, nextEndDate, nextStartTime, nextEndTime}) => {
        setStartDate(nextStartDate);
        setEndDate(nextEndDate);
        setStartTime(nextStartTime);
        setEndTime(nextEndTime);
    }, []);

    const syncAndApplyEventRange = useCallback(({startDateValue, endDateValue, startTimeValue, endTimeValue}) => {
        const result = syncEventRange({
            startDate: startDateValue,
            endDate: endDateValue,
            startTime: startTimeValue,
            endTime: endTimeValue,
        });

        applySyncedEventRange(result);
    }, [applySyncedEventRange]);

    const normalizeCalendarField = useCallback((value) => {
        const parsed = resolveCalendarInput(value);

        if (!parsed?.selectedDate) {
            return value;
        }

        return formatDateToPopupString(parsed.selectedDate);
    }, []);

    const normalizeOpenCalendarField = useCallback(() => {
        if (openCalendar === "start") {
            setStartDate((prev) => normalizeCalendarField(prev));
        }

        if (openCalendar === "end") {
            setEndDate((prev) => normalizeCalendarField(prev));
        }
    }, [normalizeCalendarField, openCalendar]);

    const closeCalendar = useCallback(() => {
        normalizeOpenCalendarField();
        setOpenCalendar(null);
    }, [normalizeOpenCalendarField]);

    const closeTimeZone = useCallback(() => {
        setIsOpenTimeZone(false);
    }, []);

    const closeCountry = useCallback(() => {
        setIsOpenCountry(false);
    }, []);

    const outsideRefs = useMemo(
        () => [[calendarRef, popupCalendarRef], [timeZoneRef], [countryRef]],
        []
    );

    const outsideCallbacks = useMemo(
        () => [closeCalendar, closeTimeZone, closeCountry],
        [closeCalendar, closeTimeZone, closeCountry]
    );

    useOutsideClose({
        refs: outsideRefs,
        callbacks: outsideCallbacks,
    });

    useEffect(() => {
        if (isOpenTimeZone && activeTimeZoneRef.current) {
            activeTimeZoneRef.current.scrollIntoView({
                block: "center",
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

    const handleStartDateSelect = useCallback((dateObj) => {
        const nextStartDate = formatDateToPopupString(dateObj);

        syncAndApplyEventRange({
            startDateValue: nextStartDate,
            endDateValue: endDate,
            startTimeValue: startTime,
            endTimeValue: endTime,
        });
    }, [endDate, endTime, startTime, syncAndApplyEventRange]);

    const handleEndDateSelect = useCallback((dateObj) => {
        const nextEndDate = formatDateToPopupString(dateObj);

        syncAndApplyEventRange({
            startDateValue: startDate,
            endDateValue: nextEndDate,
            startTimeValue: startTime,
            endTimeValue: endTime,
        });
    }, [endTime, startDate, startTime, syncAndApplyEventRange]);

    const handleSubmit = useCallback(async (e) => {
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
    }, [description, endDate, endTime, onClose, startDate, startTime, timeZone, title]);

    return {
        values: {
            title,
            description,
            startDate,
            endDate,
            startTime,
            endTime,
            timeZone,
            country,
            openCalendar,
            isOpenTimeZone,
            isOpenCountry,
            countries,
            parsedStartCalendar,
            parsedEndCalendar,
            gmtOptions: GMT_OPTIONS,
        },
        setters: {
            setTitle,
            setDescription,
            setStartDate,
            setEndDate,
            setStartTime,
            setEndTime,
            setTimeZone,
            setCountry,
            setOpenCalendar,
            setIsOpenTimeZone,
            setIsOpenCountry,
        },
        refs: {
            calendarRef,
            popupCalendarRef,
            timeZoneRef,
            activeTimeZoneRef,
            countryRef,
            activeCountryRef,
        },
        handlers: {
            handleSubmit,
            syncAndApplyEventRange,
            handleStartDateSelect,
            handleEndDateSelect,
        },
    };
}
