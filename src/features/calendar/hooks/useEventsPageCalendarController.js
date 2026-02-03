import {useCallback, useMemo, useRef, useState} from "react";
import { DEFAULT_START_DATE, DEFAULT_VIEW } from "@features/calendar/constants/eventsPage.constants";
import { toggleSelected } from "@features/calendar/utils/selection.utils";

function toSelectedDate(value) {
    return new Date(Date.UTC(value.year, value.monthIndex, value.day));
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

    const yearCalApiRef = useRef({
        scrollToMonth: () => {},
    });

    const syncToDate = useCallback((d) => {
        setWeekAnchorDate(d);
        setDayDate(d);

        const year = d.getFullYear();
        const monthIndex = d.getMonth();

        setMonthView({ year, monthIndex });

        requestAnimationFrame(() => {
            yearCalApiRef.current?.scrollToMonth?.(monthIndex);
        });
    }, []);

    const onSelect = useCallback((value) => {
        setSelected((prev) => toggleSelected(prev, value));
        syncToDate(toSelectedDate(value));
    }, [syncToDate]);

    const onDayChangeView = useCallback((newDate) => {
        syncToDate(newDate);
    }, [syncToDate]);

    const onMonthChangeView = useCallback((updater) => {
        const next = typeof updater === "function" ? updater(monthView) : updater;
        setMonthView(next);
        requestAnimationFrame(() => {
            yearCalApiRef.current?.scrollToMonth?.(next.monthIndex);
        });
    }, [monthView]);

    const onWeekChangeView = useCallback((d) => {
        setWeekAnchorDate(d);

        const year = d.getFullYear();
        const monthIndex = d.getMonth();

        setMonthView({ year, monthIndex });

        requestAnimationFrame(() => {
            yearCalApiRef.current?.scrollToMonth?.(monthIndex);
        });
    }, []);


    const onYearChangeView = useCallback((updater) => {
        const nextYear = typeof updater === "function" ? updater(monthView.year) : updater;
        setMonthView((prev) => ({...prev, year: nextYear}));
    }, [monthView.year]);

    return useMemo(
        () => ({
            view,
            setView,

            selected,
            setSelected,

            weekAnchorDate,
            dayDate,
            monthView,

            onSelect,
            onDayChangeView,
            onMonthChangeView,
            onWeekChangeView,
            onYearChangeView,

            yearCalApiRef,
        }),
        [view, selected, weekAnchorDate, dayDate, monthView, onSelect, onDayChangeView, onMonthChangeView, onWeekChangeView, onYearChangeView]
    );
}