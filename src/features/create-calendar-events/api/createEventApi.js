const BASE_URL = "http://localhost:8082";

export async function createEvent(eventData) {
    try {
        const response = await fetch(`${BASE_URL}/calendar/create-event`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to create event");
        }

        return await response.json();

    } catch (error) {
        console.error("Create event error:", error);
        throw error;
    }
}
