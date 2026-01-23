import { useMemo } from "react";
import { buildMonthGrid } from "@features/calendar/utils/monthCalendar.utils";

export function useMonthGrid(year, monthIndex) {
    return useMemo(() => buildMonthGrid(year, monthIndex), [year, monthIndex]);
}
