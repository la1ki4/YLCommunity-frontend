import {createEvent} from "@features/create-calendar-events/api/createEventApi.js";
import {formattedToISO} from "@features/calendar/utils/calendarDate.utils.js";

export async function handleCreateEvent({
                                            title,
                                            description,
                                            startDate,
                                            endDate,
                                            startTime,
                                            endTime,
                                            timeZone
                                        }) {

    startDate = formattedToISO(startDate);
    endDate = formattedToISO(endDate);

    const startDateTime = `${startDate}T${startTime}:00${timeZone.replace("GMT", "")}`;
    const endDateTime = `${endDate}T${endTime}:00${timeZone.replace("GMT", "")}`;


    const eventData = {
        title,
        description,
        startDate: startDateTime,
        endDate: endDateTime,
    };

    return await createEvent(eventData);
}