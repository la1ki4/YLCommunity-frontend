import {MONTH_NAMES} from "@features/calendar/constants/calendar.constants.js";

export function getMinutesFromStartOfDay(date) {
    return date.getHours() * 60 + date.getMinutes();
}

export function formatDayTitle(date) {
    const dayNum = date.getDate();
    const monthText = MONTH_NAMES[date.getMonth()];
    const yearText = date.getFullYear();

    return `${monthText} ${dayNum}, ${yearText}`;
}

function isOverlap(a, b) {
    return a.start < b.end && b.start < a.end;
}

function groupOverlappingEvents(events) {
    const groups = [];

    events.forEach(event => {
        let placed = false;

        for (const group of groups) {
            if (group.some(e => isOverlap(e, event))) {
                group.push(event);
                placed = true;
                break;
            }
        }

        if (!placed) {
            groups.push([event]);
        }
    });

    return groups;
}

export function prepareDayEvents(events) {
    const sorted = [...events].sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    const groups = groupOverlappingEvents(
        sorted.map(e => ({
            ...e,
            start: new Date(e.startDate),
            end: new Date(e.endDate),
        }))
    );

    return groups.flatMap(group =>
        group.map((event, index) => ({
            ...event,
            overlapIndex: index,
            overlapCount: group.length,
        }))
    );
}




