import { useMemo, useRef, useState } from "react";
import { DEFAULT_START_DATE, DEFAULT_VIEW } from "@features/calendar/constants/eventsPage.constants";
import { toggleSelected } from "@features/calendar/utils/selection.utils";

function toSelectedDate(value) {
    return new Date(value.year, value.monthIndex, value.day);
}

export function useEventsPageCalendarController() {
    const [view, setView] = useState(DEFAULT_VIEW);
    const [selected, setSelected] = useState(null);

    const [weekAnchorDate, setWeekAnchorDate] = useState(() => DEFAULT_START_DATE);
    const [dayDate, setDayDate] = useState(() => DEFAULT_START_DATE);
    const [monthView, setMonthView] = useState(() => ({
        year: DEFAULT_START_DATE.getFullYear(),
        monthIndex: DEFAULT_START_DATE.getMonth(),
    }));

    const [miniView, setMiniView] = useState(() => ({
        year: DEFAULT_START_DATE.getFullYear(),
        monthIndex: DEFAULT_START_DATE.getMonth(),
    }));

    const yearCalApiRef = useRef({
        scrollToMonth: (_monthIndex) => {},
    });

    const syncToDate = (d) => {
        setWeekAnchorDate(d);
        setDayDate(d);

        const year = d.getFullYear();
        const monthIndex = d.getMonth();

        setMonthView({ year, monthIndex });
        setMiniView({ year, monthIndex });

        requestAnimationFrame(() => {
            yearCalApiRef.current?.scrollToMonth?.(monthIndex);
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onMiniSelect = (value) => {
        setSelected((prev) => toggleSelected(prev, value));
        syncToDate(toSelectedDate(value));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onYearSelect = (value) => {
        setSelected((prev) => toggleSelected(prev, value));
        syncToDate(toSelectedDate(value));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onDayChange = (newDate) => {
        syncToDate(newDate);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onMonthChangeView = (updater) => {
        const next = typeof updater === "function" ? updater(monthView) : updater;
        setMonthView(next);
        setMiniView({ year: next.year, monthIndex: next.monthIndex });

        requestAnimationFrame(() => {
            yearCalApiRef.current?.scrollToMonth?.(next.monthIndex);
        });
    };

    const onWeekAnchorChange = (d) => {
        setWeekAnchorDate(d);

        const year = d.getFullYear();
        const monthIndex = d.getMonth();

        setMiniView({ year, monthIndex });
        setMonthView({ year, monthIndex });

        requestAnimationFrame(() => {
            yearCalApiRef.current?.scrollToMonth?.(monthIndex);
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setYear = (updater) => {
        const nextYear = typeof updater === "function" ? updater(miniView.year) : updater;

        setMiniView((prev) => ({ ...prev, year: nextYear }));
        setMonthView((prev) => ({ ...prev, year: nextYear }));
    };

    return useMemo(
        () => ({
            view,
            setView,

            selected,
            setSelected,

            weekAnchorDate,
            dayDate,
            monthView,
            miniView,

            onMiniSelect,
            onDayChange,
            onMonthChangeView,
            onYearSelect,
            onWeekAnchorChange,
            setYear,

            yearCalApiRef,
        }),
        [view, selected, weekAnchorDate, dayDate, monthView, miniView, onMiniSelect, onDayChange, onMonthChangeView, onYearSelect, setYear]
    );
}
