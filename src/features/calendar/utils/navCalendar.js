import { addDays, startOfWeekMonday } from "@features/calendar/utils/calendarDate.utils";

/**
 * Фабрика навигации по календарю
 */
export function createNavCalendar({
                                      setAnchor,
                                      setWeekStart,
                                      onAnchorDateChange,
                                  }) {
    /**
     * @param {number} step - шаг (1 = день, 7 = неделя)
     * @param {"prev" | "next"} action - направление
     */
    return function navCalendar(step, action) {
        setAnchor((prev) => {
            const delta = action === "prev" ? -step : step;
            const next = addDays(prev, delta);

            setWeekStart(startOfWeekMonday(next));
            onAnchorDateChange?.(next);

            return next;
        });
    };
}
