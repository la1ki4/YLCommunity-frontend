import {getDayCalendarEvents} from "@features/get-calendar-events/api/getDayEventsApi.js";

export async function loadDayEvents(date) {
    try {
        return await getDayCalendarEvents(date);
    } catch (error) {
        console.error(error);
    }
}
