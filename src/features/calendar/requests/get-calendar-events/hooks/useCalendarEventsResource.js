import {useEffect} from "react";
import {useAsyncResource} from "@shared/hooks/useAsyncResource.js";

const CALENDAR_EVENT_CREATED = "calendar-event-created";

export function useCalendarEventsResource(loader, deps) {
    const {data, reload} = useAsyncResource(loader, deps, []);

    useEffect(() => {
        function handleCalendarEventCreated() {
            reload().catch((requestError) => {
                console.error(requestError);
            });
        }

        window.addEventListener(CALENDAR_EVENT_CREATED, handleCalendarEventCreated);

        return () => {
            window.removeEventListener(CALENDAR_EVENT_CREATED, handleCalendarEventCreated);
        };
    }, [reload]);

    return data ?? [];
}
