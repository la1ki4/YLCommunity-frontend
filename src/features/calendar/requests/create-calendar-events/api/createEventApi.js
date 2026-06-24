import { postJson } from "@shared/api/httpClient.js";
import { CALENDAR_API } from "@shared/config/apiEndpoints.js";

export async function createEvent(eventData) {
    return postJson(`${CALENDAR_API}/calendar/create-event`, eventData);
}
