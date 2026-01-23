import { MINI_CALENDAR_CELL_COUNT, DAYS_IN_WEEK } from "@features/calendar/constants/miniCalendar.constants";

/**
 * Строит сетку 6x7 (42 ячейки) для месяца.
 * Понедельник — первый день недели.
 */
export function buildWeeks(year, monthIndex) {
    const first = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const prevMonthDays = new Date(year, monthIndex, 0).getDate();

    // Mon-first offset: Mon=0 ... Sun=6
    const startOffset = (first.getDay() + 6) % 7;

    const cells = [];

    // Добиваем дни предыдущего месяца
    for (let i = startOffset - 1; i >= 0; i--) {
        const d = prevMonthDays - i;
        cells.push({ label: String(d), isOtherMonth: true });
    }

    // Дни текущего месяца
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ label: String(d), isOtherMonth: false });
    }

    // Добиваем дни следующего месяца до 42
    let nextDay = 1;
    while (cells.length < MINI_CALENDAR_CELL_COUNT) {
        cells.push({ label: String(nextDay), isOtherMonth: true });
        nextDay++;
    }

    const weeks = [];
    for (let i = 0; i < MINI_CALENDAR_CELL_COUNT; i += DAYS_IN_WEEK) {
        weeks.push(cells.slice(i, i + DAYS_IN_WEEK));
    }

    return weeks;
}

/**
 * Сдвигает месяц на delta (например -1 или +1), возвращает {year, monthIndex}
 */
export function shiftMonth(year, monthIndex, delta) {
    const date = new Date(year, monthIndex + delta, 1);
    return { year: date.getFullYear(), monthIndex: date.getMonth() };
}
