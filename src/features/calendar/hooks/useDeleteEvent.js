import {useCallback} from "react";
import {handleDeleteEvent} from "@features/calendar/requests/delete-calendar-event/services/deleteEventHandler.js";

export function useDeleteEvent({
                                   setEvents,
                                   closePopup,
                               }) {
    const removeEvent = useCallback((eventId) => {
        setEvents(prev =>
            prev.filter(event => event.id !== eventId)
        );
    }, [setEvents]);

    return useCallback(async (eventId) => {
        try {
            await handleDeleteEvent(eventId);

            removeEvent(eventId);

            closePopup?.();
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    }, [removeEvent, closePopup]);
}