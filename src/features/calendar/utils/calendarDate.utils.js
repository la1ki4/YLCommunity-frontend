export function startOfWeekMonday(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const day = d.getDay();
    const diff = (day + 6) % 7;
    d.setDate(d.getDate() - diff);

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

