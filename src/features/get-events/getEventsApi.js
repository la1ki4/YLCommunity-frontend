export async function getCalendarEvents(date) {
    const yyyyMmDd = date.toISOString().slice(0, 10);
    const response = await fetch(`http://localhost:8082/calendar/day-event?date=${yyyyMmDd}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to load events");
    }

    return response.json();
}
