import {MONTH_NAMES} from "@features/calendar/constants/calendar.constants.js";
import {PX_PER_MINUTE} from "@features/calendar/constants/dayCalendar.constants.js";

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

export function calculateEventPositionAndSize({
                                                  event,
                                                  selectedEvent,
                                              }) {

    const startMinutes = getMinutesFromStartOfDay(event.start);
    const durationMinutes = (event.end - event.start) / 1000 / 60;
    const top = startMinutes * PX_PER_MINUTE;
    const height = durationMinutes * PX_PER_MINUTE;
    const reservedRight = 3;
    const overlapGap = 1;
    const availableWidth = 100 - reservedRight + overlapGap;
    const width = availableWidth / (event.overlapIndex + 1);
    const left = (width - overlapGap) * event.overlapIndex;
    const isSelected = selectedEvent === event;

    return {
        top,
        height,
        left,
        width,
        isSelected,
        reservedRight
    };
}




