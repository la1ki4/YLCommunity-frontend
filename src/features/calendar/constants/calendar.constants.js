export const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const MONTH_NAMES = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

export const DOW_FULLNAME = [
    "Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday","Sunday"
];

export const NOW_TICK_MS = 30_000;
export const GRID_CELL_COUNT = 42;
export const DAYS_IN_WEEK = 7;

export const GMT_OPTIONS = Array.from({ length: 23 }, (_, i) => {
    const hour = i - 11;
    const sign = hour >= 0 ? "+" : "-";
    return `GMT${sign}${String(Math.abs(hour)).padStart(2, "0")}`;
});
