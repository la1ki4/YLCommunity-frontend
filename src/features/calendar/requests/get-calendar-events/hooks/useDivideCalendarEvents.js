import {useMemo} from "react";

const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(value) {
    return value instanceof Date ? value : new Date(value);
}

function getDayStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getRangeBoundaries({viewDate, startDate, endDate}) {
    if (viewDate) {
        const dayStart = getDayStart(viewDate);

        return {
            rangeStart: dayStart,
            rangeEnd: new Date(dayStart.getTime() + DAY_MS),
        };
    }

    if (startDate && endDate) {
        const rangeStart = getDayStart(toDate(startDate));
        const rangeEndDay = getDayStart(toDate(endDate));

        return {
            rangeStart,
            rangeEnd: new Date(rangeEndDay.getTime() + DAY_MS),
        };
    }

    return null;
}

export function useDivideCalendarEvents({events, viewDate, startDate, endDate}) {
    return useMemo(() => {
        const timelineEvents = [];
        const longEvents = [];

        const boundaries = getRangeBoundaries({viewDate, startDate, endDate});

        if (!boundaries) {
            return {timelineEvents, longEvents};
        }

        const {rangeStart, rangeEnd} = boundaries;

        events.forEach((event) => {
            const start = toDate(event.startDate);
            const end = toDate(event.endDate);

            if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
                return;
            }

            const durationMs = end.getTime() - start.getTime();
            const intersectsRange = start < rangeEnd && end > rangeStart;

            if (!intersectsRange) {
                return;
            }

            if (durationMs >= DAY_MS) {
                longEvents.push({
                    ...event,
                    start,
                    end,
                });

                return;
            }

            let segmentCursor = new Date(start);

            while (segmentCursor < end) {
                const segmentDayStart = getDayStart(segmentCursor);
                const segmentDayEnd = new Date(segmentDayStart.getTime() + DAY_MS);
                const segmentStart = segmentCursor > segmentDayStart ? segmentCursor : segmentDayStart;
                const segmentEnd = end < segmentDayEnd ? end : segmentDayEnd;

                if (segmentEnd > segmentStart && segmentStart < rangeEnd && segmentEnd > rangeStart) {
                    timelineEvents.push({
                        ...event,
                        startDate: segmentStart.toISOString(),
                        endDate: segmentEnd.toISOString(),
                        originalStartDate: start.toISOString(),
                        originalEndDate: end.toISOString(),
                    });
                }

                segmentCursor = segmentDayEnd;
            }
        });

        return {timelineEvents, longEvents};
    }, [events, viewDate, startDate, endDate]);
}
