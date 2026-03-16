import {DOW_FULLNAME, MONTH_NAMES} from "@features/calendar/constants/calendar.constants.js";

export function getMonday(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const day = d.getDay();
    const diff = (day + 6) % 7;
    d.setDate(d.getDate() - diff);
    return d;
}

export function getSunday(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const day = d.getDay();
    const diff = (7 - day) % 7;
    d.setDate(d.getDate() + diff);

    return d;
}

export function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

export function isSelectedInThisWeek(selected, weekStart) {
    if (!selected) return false;

    const d = new Date(selected.year, selected.monthIndex, selected.day);

    const start = new Date(weekStart);
    start.setHours(0, 0, 0, 0);
    const end = addDays(start, 6);
    end.setHours(23, 59, 59, 999);

    return d >= start && d <= end;
}

export function isDateInWeek(date, weekStart) {
    const d = new Date(date);
    const start = new Date(weekStart);
    const end = addDays(start, 6);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return d >= start && d <= end;
}

export function getMondayBasedDayIndex(date) {
    return (date.getDay() + 6) % 7;
}

export function formattedToISO(formattedDate) {
    if (!formattedDate) return null;

    const parts = formattedDate.split(",").map(p => p.trim());

    if (parts.length < 2) {
        throw new Error("Invalid date format");
    }

    const dayMonthPart = parts[1];
    const year = parts[2] ? Number(parts[2]) : new Date().getFullYear();

    const tokens = dayMonthPart.split(" ").filter(Boolean);

    let monthName;
    let day;

    if (isNaN(tokens[0])) {
        monthName = tokens[0];
        day = tokens[1];
    } else {
        day = tokens[0];
        monthName = tokens[1];
    }

    const monthIndex = MONTH_NAMES.indexOf(monthName);

    if (monthIndex === -1) {
        throw new Error("Invalid month name");
    }

    const month = String(monthIndex + 1).padStart(2, "0");
    const dayFormatted = String(day).padStart(2, "0");

    return `${year}-${month}-${dayFormatted}`;
}

export function getNearestDateTime(offsetHours = 0) {
    const now = new Date();

    now.setHours(now.getHours() + offsetHours);

    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    const rounded = Math.ceil(totalMinutes / 30) * 30;

    const resultDate = new Date(now);

    let hours = Math.floor(rounded / 60);
    let minutes = rounded % 60;

    if (hours >= 24) {
        resultDate.setDate(resultDate.getDate() + 1);
        hours = 0;
        minutes = 0;
    }

    const timeString =
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    const dayOfWeekIndex = (resultDate.getDay() + 6) % 7;
    const dayOfWeek = DOW_FULLNAME[dayOfWeekIndex];
    const day = resultDate.getDate();
    const month = MONTH_NAMES[resultDate.getMonth()];

    const dateString = `${dayOfWeek}, ${month} ${day}`;

    return {
        date: dateString,
        time: timeString
    };
}

export function normalizePopupTimeInput(value, offsetHours = 0) {
    const fallbackTime = getNearestDateTime(offsetHours).time;

    if (!value || typeof value !== "string") {
        return fallbackTime;
    }

    const trimmed = value.trim();

    if (!/^\d{2}:\d{2}$/.test(trimmed)) {
        return fallbackTime;
    }

    const [hoursString, minutesString] = trimmed.split(":");
    const hours = Number(hoursString);
    const minutes = Number(minutesString);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return fallbackTime;
    }

    if (hours < 0 || hours > 23) {
        return fallbackTime;
    }

    if (minutes < 0 || minutes > 59) {
        return fallbackTime;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatDateToPopupString(date) {
    if (!date) return "";

    const today = new Date();
    const currentYear = today.getFullYear();

    const dayOfWeekIndex = (date.getDay() + 6) % 7;
    const dayOfWeek = DOW_FULLNAME[dayOfWeekIndex];
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();

    if (year === currentYear) {
        return `${dayOfWeek}, ${month} ${day}`;
    }

    return `${dayOfWeek}, ${month} ${day}, ${year}`;
}

function getDaysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
}

function normalizeYear(num, currentYear) {
    if (num == null || Number.isNaN(num)) return currentYear;

    if (num >= 1000) return num;

    if (num >= 0 && num <= 99) {
        const currentCentury = Math.floor(currentYear / 100) * 100;
        return currentCentury + num;
    }

    return currentYear;
}

function findMonthIndex(token) {
    if (!token) return null;

    const normalized = token.trim().toLowerCase();

    const index = MONTH_NAMES.findIndex((month) =>
        month.toLowerCase().startsWith(normalized)
    );

    return index === -1 ? null : index;
}

function isDayOfWeekToken(token) {
    if (!token) return false;

    const normalized = token
        .toLowerCase()
        .replace(/,/g, "")
        .trim();

    return DOW_FULLNAME.some(
        (dayName) => dayName.toLowerCase() === normalized
    );
}

export function resolveCalendarInput(input) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();

    const fallback = {
        viewYear: currentYear,
        viewMonthIndex: currentMonthIndex,
        selectedDate: today,
    };

    if (!input || typeof input !== "string" || !input.trim()) {
        return fallback;
    }

    const tokens = input
        .trim()
        .split(/\s+/)
        .map((token) => token.replace(/,/g, "").trim())
        .filter(Boolean);

    let monthIndex = null;
    const numberTokens = [];

    for (const token of tokens) {
        if (isDayOfWeekToken(token)) {
            continue;
        }

        if (/^\d+$/.test(token)) {
            numberTokens.push(Number(token));
            continue;
        }

        if (/^[a-zA-Z]+$/.test(token)) {
            const foundMonth = findMonthIndex(token);

            if (foundMonth !== null) {
                monthIndex = foundMonth;
                continue;
            }
        }

        return fallback;
    }

    const resolvedMonthIndex = monthIndex ?? currentMonthIndex;

    let resolvedYear = currentYear;
    let resolvedDay = null;

    if (numberTokens.length === 1) {
        const first = numberTokens[0];
        const maxDay = getDaysInMonth(currentYear, resolvedMonthIndex);

        if (first >= 1 && first <= maxDay) {
            resolvedDay = first;
        } else {
            resolvedYear = normalizeYear(first, currentYear);
        }
    }

    if (numberTokens.length >= 2) {
        const first = numberTokens[0];
        const second = numberTokens[1];

        const tentativeYearFromSecond = normalizeYear(second, currentYear);
        const maxDayIfFirstIsDay = getDaysInMonth(
            tentativeYearFromSecond,
            resolvedMonthIndex
        );

        if (first >= 1 && first <= maxDayIfFirstIsDay) {
            resolvedDay = first;
            resolvedYear = tentativeYearFromSecond;
        } else {
            resolvedYear = normalizeYear(first, currentYear);

            const maxDayIfSecondIsDay = getDaysInMonth(
                resolvedYear,
                resolvedMonthIndex
            );

            if (second >= 1 && second <= maxDayIfSecondIsDay) {
                resolvedDay = second;
            }
        }
    }

    let selectedDate = null;

    if (resolvedDay !== null) {
        const maxDay = getDaysInMonth(resolvedYear, resolvedMonthIndex);

        if (resolvedDay >= 1 && resolvedDay <= maxDay) {
            selectedDate = new Date(resolvedYear, resolvedMonthIndex, resolvedDay);
        }
    }

    return {
        viewYear: resolvedYear,
        viewMonthIndex: resolvedMonthIndex,
        selectedDate: selectedDate ?? new Date(resolvedYear, resolvedMonthIndex, 1),
    };
}

function parseTimeToMinutes(timeString) {
    if (!timeString || typeof timeString !== "string") return null;

    const trimmed = timeString.trim();

    if (!/^\d{2}:\d{2}$/.test(trimmed)) return null;

    const [hoursString, minutesString] = trimmed.split(":");
    const hours = Number(hoursString);
    const minutes = Number(minutesString);

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return null;
    }

    return hours * 60 + minutes;
}

function addOneHourToTime(timeString) {
    const totalMinutes = parseTimeToMinutes(timeString);

    if (totalMinutes == null) {
        return {
            nextTime: getNearestDateTime(1).time,
            movedToNextDay: false,
        };
    }

    const increased = totalMinutes + 60;
    const movedToNextDay = increased >= 24 * 60;
    const normalized = increased % (24 * 60);

    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;

    return {
        nextTime: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
        movedToNextDay,
    };
}

function addOneDay(date) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate;
}

export function syncEventRange({
                            startDate,
                            endDate,
                            startTime,
                            endTime,
                        }) {
    const normalizedStartTime = normalizePopupTimeInput(startTime, 0);
    let normalizedEndTime = normalizePopupTimeInput(endTime, 1);

    const startDateParsed = resolveCalendarInput(startDate).selectedDate;
    let endDateParsed = resolveCalendarInput(endDate).selectedDate;

    if (startDateParsed.getTime() > endDateParsed.getTime()) {
        endDateParsed = new Date(startDateParsed);
    }

    const sameDay =
        startDateParsed.getFullYear() === endDateParsed.getFullYear() &&
        startDateParsed.getMonth() === endDateParsed.getMonth() &&
        startDateParsed.getDate() === endDateParsed.getDate();

    const startMinutes = parseTimeToMinutes(normalizedStartTime);
    const endMinutes = parseTimeToMinutes(normalizedEndTime);

    if (
        sameDay &&
        startMinutes != null &&
        endMinutes != null &&
        startMinutes > endMinutes
    ) {
        const { nextTime, movedToNextDay } = addOneHourToTime(normalizedStartTime);

        normalizedEndTime = nextTime;

        if (movedToNextDay) {
            endDateParsed = addOneDay(endDateParsed);
        }
    }

    return {
        nextStartDate: formatDateToPopupString(startDateParsed),
        nextEndDate: formatDateToPopupString(endDateParsed),
        nextStartTime: normalizedStartTime,
        nextEndTime: normalizedEndTime,
    };
}



