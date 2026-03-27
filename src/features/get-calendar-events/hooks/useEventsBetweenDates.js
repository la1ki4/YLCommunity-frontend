import {useMemo} from "react";
import { getEventsBetweenDates } from "@features/get-calendar-events/api/getEventsBetweenDatesApi.js";
import {useCalendarEventsResource} from "@features/get-calendar-events/hooks/useCalendarEventsResource.js";

export function useEventsBetweenDates({ startDate, endDate }) {
    const loader = useMemo(() => () => getEventsBetweenDates(startDate, endDate), [startDate, endDate]);
    const data = useCalendarEventsResource(loader, [loader]);

    return data ?? [];
}
