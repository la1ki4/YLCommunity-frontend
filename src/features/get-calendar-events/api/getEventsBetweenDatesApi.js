import { getJson } from "@shared/api/httpClient.js";
import { CALENDAR_API } from "@shared/config/apiEndpoints.js";

function toYyyyMmDd(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export async function getEventsBetweenDates(startDate, endDate) {

    const start = toYyyyMmDd(startDate);
    const end = toYyyyMmDd(endDate);

    return getJson(
        `${CALENDAR_API}/calendar/between-dates?startDate=${start}&endDate=${end}`
    );
}
