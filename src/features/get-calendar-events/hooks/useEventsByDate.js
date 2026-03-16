import { useMemo } from "react";
import { getDayCalendarEvents } from "@features/get-calendar-events/api/getDayEventsApi.js";
import { useAsyncResource } from "@shared/hooks/useAsyncResource.js";

export function useEventsByDate({ date }) {
    const loader = useMemo(() => () => getDayCalendarEvents(date), [date]);
    const { data } = useAsyncResource(loader, [loader], []);

    return data ?? [];
}
