import { getJson } from "@shared/api/httpClient.js";
import { CALENDAR_API } from "@shared/config/apiEndpoints.js";

export async function getDayCalendarEvents(date) {
    const yyyyMmDd = date.toISOString().slice(0, 10);
    return getJson(`${CALENDAR_API}/calendar/day-event?date=${yyyyMmDd}`);
}
