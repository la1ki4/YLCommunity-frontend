import { useMemo } from "react";
import { addDays, isSelectedInThisWeek } from "@features/calendar/utils/calendarDate.utils";
import {isSameDay} from "@features/calendar/utils/dateMatch.utils.js";

export function useWeekDays({ weekStart, selected, dowLabels }) {
    return useMemo(() => {
        const today = new Date();
        const hasSelectedThisWeek = isSelectedInThisWeek(selected, weekStart);

        return dowLabels.map((label, i) => {
            const dateObj = addDays(weekStart, i);

            const isSelected =
                !!selected &&
                selected.year === dateObj.getFullYear() &&
                selected.monthIndex === dateObj.getMonth() &&
                selected.day === dateObj.getDate();

            const isToday = !selected && isSameDay(dateObj, today);
            const shouldHighlight = hasSelectedThisWeek ? isSelected : isToday;

            return {
                label,
                dateObj,
                date: dateObj.getDate(),
                selected: shouldHighlight,
            };
        });
    }, [weekStart, selected, dowLabels]);
}
