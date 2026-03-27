import { useEffect, useMemo } from "react";
import { getEventsBetweenDates } from "@features/get-calendar-events/api/getEventsBetweenDatesApi.js";
import { useAsyncResource } from "@shared/hooks/useAsyncResource.js";

export function useEventsBetweenDates({ startDate, endDate }) {
    const loader = useMemo(() => () => getEventsBetweenDates(startDate, endDate), [startDate, endDate]);
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
