import { useEffect, useMemo } from "react";
import { getDayCalendarEvents } from "@features/get-calendar-events/api/getDayEventsApi.js";
import { useAsyncResource } from "@shared/hooks/useAsyncResource.js";

export function useEventsByDate({ date }) {
    const loader = useMemo(() => () => getDayCalendarEvents(date), [date]);
    const { data, reload } = useAsyncResource(loader, [loader], []);

    useEffect(() => {
        function handleCalendarEventCreated() {
            reload().catch((requestError) => {
                console.error(requestError);
            });
        }

        window.addEventListener("calendar-event-created", handleCalendarEventCreated);

        return () => {
            window.removeEventListener("calendar-event-created", handleCalendarEventCreated);
        };
    }, [reload]);

    return data ?? [];
}
