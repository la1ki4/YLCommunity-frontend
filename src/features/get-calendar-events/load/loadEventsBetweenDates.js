import {getEventsBetweenDates} from "@features/get-calendar-events/api/getEventsBetweenDatesApi.js";

export async function loadEventsBetweenDates(startDate, endDate) {
    try {
        return await getEventsBetweenDates(startDate, endDate);
    } catch (error) {
        console.error(error);
    }
}