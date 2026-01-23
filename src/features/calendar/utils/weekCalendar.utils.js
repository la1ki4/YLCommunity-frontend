import { HOURS_IN_DAY, MINUTES_IN_DAY } from "@features/calendar/constants/weekCalendar.constants";

export function buildHours() {
    return Array.from({ length: HOURS_IN_DAY }, (_, i) => i);
}

export function minutesFromStartOfDay(date) {
    return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

export function calcNowTopPx(now, gridHeight) {
    if (!gridHeight) return 0;
    const minutes = minutesFromStartOfDay(now);
    return (minutes / MINUTES_IN_DAY) * gridHeight;
}
