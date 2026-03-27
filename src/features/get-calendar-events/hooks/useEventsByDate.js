import {useMemo} from "react";
import { getDayCalendarEvents } from "@features/get-calendar-events/api/getDayEventsApi.js";
import {useCalendarEventsResource} from "@features/get-calendar-events/hooks/useCalendarEventsResource.js";

export function useEventsByDate({ date }) {
    const loader = useMemo(() => () => getDayCalendarEvents(date), [date]);
    const data = useCalendarEventsResource(loader, [loader]);

    return data ?? [];
}
