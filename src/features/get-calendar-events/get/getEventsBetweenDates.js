import {useEffect, useState} from "react";
import {loadEventsBetweenDates} from "@features/get-calendar-events/load/loadEventsBetweenDates.js";

export function useEventsBetweenDate(props) {
    const {startDate, endDate} = props;
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEventsBetweenDates() {
            try {
                const result = await loadEventsBetweenDates(startDate, endDate);
                setEvents(result ?? []);
            } catch (e) {
                console.error(e);
            }
        }

        fetchEventsBetweenDates();
    }, [
        startDate,
        endDate
    ]);

    return events;
}