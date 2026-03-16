function toYyyyMmDd(date) {
    return date.toISOString().slice(0, 10);
}

export async function getEventsBetweenDates(startDate, endDate) {
    const start = toYyyyMmDd(startDate);
    const end = toYyyyMmDd(endDate);

    const response = await fetch(
        `http://localhost:8082/calendar/between-dates?startDate=${start}&endDate=${end}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load events");
    }

    return response.json();
}
