import {useMemo} from "react";

const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(value) {
    return value instanceof Date ? value : new Date(value);
}

function getDayStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function useDivideCalendarEvents({events, viewDate}) {
    return useMemo(() => {
        const timelineEvents = [];
        const longEvents = [];

        const dayStart = getDayStart(viewDate);
        const dayEnd = new Date(dayStart.getTime() + DAY_MS);

        events.forEach((event) => {
            const start = toDate(event.startDate);
            const end = toDate(event.endDate);

            if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
                return;
            }

            const durationMs = end.getTime() - start.getTime();
            const intersectsCurrentDay = start < dayEnd && end > dayStart;

            if (!intersectsCurrentDay) {
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

            const segmentStart = start > dayStart ? start : dayStart;
            const segmentEnd = end < dayEnd ? end : dayEnd;

            if (segmentEnd <= segmentStart) {
                return;
            }

            timelineEvents.push({
                ...event,
                startDate: segmentStart.toISOString(),
                endDate: segmentEnd.toISOString(),
            });
        });

        return {timelineEvents, longEvents};
    }, [events, viewDate]);
}
