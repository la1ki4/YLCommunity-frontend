import { addDays, startOfWeekMonday } from "@features/calendar/utils/calendarDate.utils";

export function createNavCalendar({
                                      setAnchor,
                                      setWeekStart,
                                      onAnchorDateChange,
                                  }) {
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
