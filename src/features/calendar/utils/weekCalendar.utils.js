import {
    DAY_COUNT_IN_WEEK,
    HOURS_IN_DAY,
    MINUTES_IN_DAY
} from "@features/calendar/constants/weekCalendar.constants";

const DAY_MS = 24 * 60 * 60 * 1000;

export function buildHours() {
    return Array.from({ length: HOURS_IN_DAY - 1 }, (_, i) => i + 1);
}

export function minutesFromStartOfDay(date) {
    return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

export function calcNowTopPx(now, gridHeight) {
    if (!gridHeight) return 0;
    const minutes = minutesFromStartOfDay(now);
    return (minutes / MINUTES_IN_DAY) * gridHeight;
}

export function formatDateKey(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

export function groupEventsByDateMap(events) {
    const map = new Map();

    events.forEach(event => {
        const key = formatDateKey(event.startDate);

        if (!map.has(key)) {
            map.set(key, []);
        }

        map.get(key).push(event);
    });

    return map;
}

export function buildLongEventSegments(longEvents, monday) {
    const mondayStart = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate());
    const sundayStart = new Date(mondayStart.getTime() + (DAY_COUNT_IN_WEEK - 1) * DAY_MS);
    const weekEndExclusive = new Date(mondayStart.getTime() + DAY_COUNT_IN_WEEK * DAY_MS);

    return longEvents
        .map((event) => {
            if (event.end <= mondayStart || event.start >= weekEndExclusive) {
                return null;
            }

            const firstDayStart = new Date(Math.max(
                new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate()).getTime(),
                mondayStart.getTime()
            ));

            const lastIncludedMoment = new Date(event.end.getTime() - 1);

            if (lastIncludedMoment < mondayStart) {
                return null;
            }

            const lastDayStart = new Date(Math.min(
                new Date(lastIncludedMoment.getFullYear(), lastIncludedMoment.getMonth(), lastIncludedMoment.getDate()).getTime(),
                sundayStart.getTime()
            ));

            const startDayIndex = Math.floor((firstDayStart.getTime() - mondayStart.getTime()) / DAY_MS);
            const endDayIndex = Math.floor((lastDayStart.getTime() - mondayStart.getTime()) / DAY_MS);

            if (endDayIndex < startDayIndex) {
                return null;
            }

            return {
                ...event,
                startDayIndex,
                endDayIndex,
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.startDayIndex - b.startDayIndex || a.endDayIndex - b.endDayIndex);
}
