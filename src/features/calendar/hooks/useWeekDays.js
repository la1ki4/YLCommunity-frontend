import { useMemo } from "react";
import { addDays, isSameYMD, isSelectedInThisWeek } from "@features/calendar/utils/calendarDate.utils";

/**
 * @param {Object} params
 * @param {Date} params.weekStart - дата понедельника текущей недели
 * @param {Object|null} params.selected - выбранная дата
 * @param {string[]} params.dowLabels - подписи дней недели (Mon..Sun)
 */
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

            const isToday = !selected && isSameYMD(dateObj, today);
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
