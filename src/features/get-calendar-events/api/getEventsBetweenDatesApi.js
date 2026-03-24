import { getJson } from "@shared/api/httpClient.js";
import { CALENDAR_API } from "@shared/config/apiEndpoints.js";

function toYyyyMmDd(date) {
    return date.toISOString().slice(0, 10);
}

export async function getEventsBetweenDates(startDate, endDate) {
    const start = toYyyyMmDd(startDate);
    const end = toYyyyMmDd(endDate);

    return getJson(
        `${CALENDAR_API}/calendar/between-dates?startDate=${start}&endDate=${end}`
    );
}
