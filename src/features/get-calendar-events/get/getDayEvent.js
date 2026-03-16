import { useEffect, useState } from "react";
import { loadDayEvents } from "@features/get-calendar-events/load/loadDayEvents.js";

export function useEventsByDate(props) {
    const {date} = props;
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const result = await loadDayEvents(date);
                setEvents(result ?? []);
            } catch (e) {
                console.error(e);
            }
        }

        fetchEvents();
    }, [date]);

    return events;
}