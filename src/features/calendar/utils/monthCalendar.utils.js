import { DAYS_IN_WEEK, GRID_CELL_COUNT } from "@features/calendar/constants/calendar.constants";
import {getMonday, getSunday} from "@features/calendar/utils/calendarDate.utils.js";

export function buildMonthGrid(year, monthIndex) {
    const first = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const prevMonthDays = new Date(year, monthIndex, 0).getDate();

    const startOffset = (first.getDay() + 6) % 7;

    const cells = [];

    for (let i = startOffset - 1; i >= 0; i--) {
        const d = prevMonthDays - i;
        cells.push({ label: String(d), isOtherMonth: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ label: String(d), isOtherMonth: false });
    }

    let nextDay = 1;

    while (cells.length < GRID_CELL_COUNT) {
        cells.push({ label: String(nextDay), isOtherMonth: true });
        nextDay++;
    }

    const weeks = [];
    for (let i = 0; i < GRID_CELL_COUNT; i += DAYS_IN_WEEK) {
        weeks.push(cells.slice(i, i + DAYS_IN_WEEK));
    }

    return weeks;
}

export function shiftMonth(year, monthIndex, delta) {
    const d = new Date(year, monthIndex + delta, 1);
    return { year: d.getFullYear(), monthIndex: d.getMonth() };
}


export function calculatePopupLeft({
                                       calendarRect,
                                       eventRect,
                                       popupRect,
                                       calendarSectionRect,
                                       calendarCellRect,
                                       colIndex,
                                   }) {
    const GAP = 800;

    const spaceLeft = calendarSectionRect.width - (calendarSectionRect.width - calendarCellRect.width * colIndex);

    const spaceRight = calendarSectionRect.width - (spaceLeft + eventRect.width);

    if (popupRect.width <= spaceLeft) {
        return (
            eventRect.left -
            calendarRect.left -
            popupRect.width +
            GAP
        );
    }

    if (popupRect.width <= spaceRight) {
        return (
            eventRect.right -
            calendarRect.left +
            GAP
        );
    }

    return (
        calendarRect.width / 2 -
        popupRect.width / 2 +
        GAP
    );
}

export function calculatePopupTop({
                                      calendarRect,
                                      eventRect,
                                      popupRect,
                                      calendarHeaderRect,
                                      calendarSectionRect,
                                      calendarRowRect,
                                      rowIndex,
                                  }) {
    const GAP = 12;

    const spaceBottom = (calendarSectionRect.height - calendarHeaderRect.height) - (calendarRowRect.height * (1 + rowIndex));


    if (spaceBottom > popupRect.height + GAP) {
        return (
            eventRect.top -
            calendarRect.top -
            popupRect.height +
            calendarHeaderRect.height +
            popupRect.height -
            GAP
        );
    }
    return (
        eventRect.top -
        calendarRect.top -
        popupRect.height +
        calendarHeaderRect.height -
        GAP
    );
}

export function getEventBlockWidth(
    event,
    currentDate
) {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    const monday = getMonday(currentDate);
    const sunday = getSunday(currentDate);

    const startUtc = Date.UTC(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
    );

    const endUtc = Date.UTC(
        end.getFullYear(),
        end.getMonth(),
        end.getDate()
    );

    const mondayUtc = Date.UTC(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate()
    );

    const sundayUtc = Date.UTC(
        sunday.getFullYear(),
        sunday.getMonth(),
        sunday.getDate()
    );

    const visibleStartUtc =
        startUtc < mondayUtc
            ? mondayUtc
            : startUtc;

    const visibleEndUtc =
        endUtc > sundayUtc
            ? sundayUtc
            : endUtc;

    return (
        (visibleEndUtc - visibleStartUtc) /
        (1000 * 60 * 60 * 24) +
        1
    );
}

export function sortEventsByDuration(events) {
    return [...events].sort((a, b) => {
        const aStart = new Date(a.startDate);
        const aEnd = new Date(a.endDate);

        const bStart = new Date(b.startDate);
        const bEnd = new Date(b.endDate);

        const aDuration =
            (Date.UTC(
                    aEnd.getFullYear(),
                    aEnd.getMonth(),
                    aEnd.getDate()
                ) -
                Date.UTC(
                    aStart.getFullYear(),
                    aStart.getMonth(),
                    aStart.getDate()
                )) /
            (1000 * 60 * 60 * 24);

        const bDuration =
            (Date.UTC(
                    bEnd.getFullYear(),
                    bEnd.getMonth(),
                    bEnd.getDate()
                ) -
                Date.UTC(
                    bStart.getFullYear(),
                    bStart.getMonth(),
                    bStart.getDate()
                )) /
            (1000 * 60 * 60 * 24);

        if (bDuration !== aDuration) {
            return bDuration - aDuration;
        }

        return aStart - bStart;
    });
}