import { DAYS_IN_WEEK, GRID_CELL_COUNT } from "@features/calendar/constants/calendar.constants";

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
