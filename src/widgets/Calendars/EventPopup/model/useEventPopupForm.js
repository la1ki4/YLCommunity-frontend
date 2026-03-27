import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {handleCreateEvent} from "@features/create-calendar-events/services/createEventHandler";
import {CITIES_BY_COUNTRY, GMT_OPTIONS} from "@features/calendar/constants/calendar.constants.js";
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

export function useEventPopupForm({isOpen, onClose}) {
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
    const [validationErrors, setValidationErrors] = useState({
        title: false,
        description: false,
    });
    const [openCalendar, setOpenCalendar] = useState(null);

    const calendarRef = useRef(null);
    const popupCalendarRef = useRef(null);
    const timeZoneRef = useRef(null);

    const activeTimeZoneRef = useRef(null);

    const locationOptions = useMemo(() => {
        return Object.keys(CITIES_BY_COUNTRY)
            .sort((a, b) => a.localeCompare(b))
            .flatMap((countryName) => {
                const sortedCities = [...(CITIES_BY_COUNTRY[countryName] ?? [])]
                    .sort((a, b) => a.localeCompare(b));

                return sortedCities.map((cityName) => `${countryName}, ${cityName}`);
            });
    }, []);

    const [country, setCountry] = useState(locationOptions[0] ?? "");
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

    const resetForm = useCallback(() => {
        const nextStartDateTime = getNearestDateTime();
        const nextEndDateTime = getNearestDateTime(1);

        setTitle("");
        setDescription("");
        setValidationErrors({
            title: false,
            description: false,
        });

        setStartDate(nextStartDateTime.date);
        setEndDate(nextEndDateTime.date);
        setStartTime(nextStartDateTime.time);
        setEndTime(nextEndDateTime.time);
        setTimeZone(getDefaultGMT());
        setCountry(locationOptions[0] ?? "");

        setOpenCalendar(null);
        setIsOpenTimeZone(false);
        setIsOpenCountry(false);
    }, [locationOptions]);

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

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

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

    const handleTitleChange = useCallback((value) => {
        setTitle(value);

        if (validationErrors.title && value.trim()) {
            setValidationErrors((prev) => ({
                ...prev,
                title: false,
            }));
        }
    }, [validationErrors.title]);

    const handleDescriptionChange = useCallback((value) => {
        setDescription(value);

        if (validationErrors.description && value.trim()) {
            setValidationErrors((prev) => ({
                ...prev,
                description: false,
            }));
        }
    }, [validationErrors.description]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const nextValidationErrors = {
            title: !title.trim(),
            description: !description.trim(),
        };

        setValidationErrors(nextValidationErrors);

        if (nextValidationErrors.title || nextValidationErrors.description) {
            return;
        }

        try {
            await handleCreateEvent({
                title,
                description,
                startDate,
                endDate,
                startTime,
                endTime,
                timeZone,
                countryAndCityFormat: country,
            });

            window.dispatchEvent(new CustomEvent("calendar-event-created"));
            onClose();
        } catch (error) {
            console.error("Error creating event:", error);
        }
    }, [country, description, endDate, endTime, onClose, startDate, startTime, timeZone, title]);

    return {
        values: {
            title,
            description,
            validationErrors,
            startDate,
            endDate,
            startTime,
            endTime,
            timeZone,
            country,
            openCalendar,
            isOpenTimeZone,
            isOpenCountry,
            locationOptions,
            parsedStartCalendar,
            parsedEndCalendar,
            gmtOptions: GMT_OPTIONS,
        },
        setters: {
            setTitle,
            setDescription,
            handleTitleChange,
            handleDescriptionChange,
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
