import {
    DAY_COUNT_IN_WEEK,
    HOURS_IN_DAY,
    MINUTES_IN_DAY, PX_PER_MINUTE
} from "@features/calendar/constants/weekCalendar.constants";
import {getMondayBasedDayIndex} from "@features/calendar/utils/calendarDate.utils.js";
import {getMinutesFromStartOfDay} from "@features/calendar/utils/dayCalendar.utils.js";

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

function isOverlapping(eventA, eventB) {
    return (
        eventA.startDate < eventB.endDate &&
        eventA.endDate > eventB.startDate
    );
}

function getDuration(event) {
    return new Date(event.endDate).getTime() -
        new Date(event.startDate).getTime();
}

export function groupEventsByDateMap(events) {
    const dayMap = new Map();

    events.forEach(event => {
        const dateKey = formatDateKey(event.startDate);

        if (!dayMap.has(dateKey)) {
            dayMap.set(dateKey, []);
        }

        dayMap.get(dateKey).push(event);
    });

    const result = new Map();

    dayMap.forEach((dayEvents, dateKey) => {
        const groups = [];

        dayEvents
            .sort((a, b) => {
                const startDiff =
                    new Date(a.startDate) - new Date(b.startDate);

                if (startDiff !== 0) {
                    return startDiff;
                }

                return getDuration(b) - getDuration(a);
            })
            .forEach(event => {
                let groupIndex = -1;

                for (let i = 0; i < groups.length; i++) {
                    const hasOverlap = groups[i].some(groupEvent =>
                        isOverlapping(groupEvent, event)
                    );

                    if (hasOverlap) {
                        groupIndex = i;
                        break;
                    }
                }

                if (groupIndex === -1) {
                    groups.push([event]);
                } else {
                    groups[groupIndex].push(event);
                }
            });

        groups.forEach((group, index) => {
            group.sort((a, b) => {
                const durationDiff =
                    getDuration(b) - getDuration(a);

                if (durationDiff !== 0) {
                    return durationDiff;
                }

                return (
                    new Date(a.startDate) -
                    new Date(b.startDate)
                );
            });

            result.set(`${dateKey}-${index}`, group);
        });
    });

    return result;
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

export function WeekCalendarLongEventsHeight(
    longEventSegments
) {
    if (longEventSegments.length === 0) {
        return 0;
    }

    const rowHeight = 28;
    const rowGap = 6;
    const verticalPadding = 8;

    const maxRow = Math.max(
        ...longEventSegments.map(
            (segment) => segment.rowIndex
        )
    );

    return (
        (maxRow + 1) * rowHeight +
        maxRow * rowGap +
        verticalPadding * 2
    );
}

export function longEventSegments(
    longEvents,
    monday
) {
    const segments =
        buildLongEventSegments(
            longEvents,
            monday
        );

    const rowsLastEnd = [];

    return segments.map((segment) => {
        let rowIndex =
            rowsLastEnd.findIndex(
                (endDayIndex) =>
                    segment.startDayIndex >
                    endDayIndex
            );

        if (rowIndex === -1) {
            rowIndex =
                rowsLastEnd.length;

            rowsLastEnd.push(
                segment.endDayIndex
            );
        } else {
            rowsLastEnd[rowIndex] =
                segment.endDayIndex;
        }

        return {
            ...segment,
            rowIndex,
        };
    });
}


export function eventSizeAndPos({
                                    event,
                                    index,
                                    selectedEvent,
                                }) {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    const startMinutes =
        getMinutesFromStartOfDay(start);

    const durationMinutes =
        (end - start) / 1000 / 60;

    const top =
        startMinutes * PX_PER_MINUTE;

    const height =
        durationMinutes * PX_PER_MINUTE;

    const dayIndex =
        getMondayBasedDayIndex(start);

    const overlap = index;

    const dayWidth = 100 / 7;

    const width = dayWidth / (index + 1);

    const left =
        dayWidth * dayIndex +
        width * index -
        overlap * 0.3;

    const isSelected =
        selectedEvent === event;

    return {
        top,
        height,
        left,
        width,
        dayIndex,
        isSelected,
    };
}
