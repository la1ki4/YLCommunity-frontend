import {deleteJson} from "@shared/api/httpClient.js";
import {CALENDAR_API} from "@shared/config/apiEndpoints.js";

export async function deleteEvent(eventId){
    return deleteJson(`${CALENDAR_API}/calendar/delete-event/${eventId}`);
}