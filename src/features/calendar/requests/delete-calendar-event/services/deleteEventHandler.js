import {deleteEvent} from "@features/calendar/requests/delete-calendar-event/api/delete-event-api.js";

export async function handleDeleteEvent(eventId){
    return deleteEvent(eventId);
}