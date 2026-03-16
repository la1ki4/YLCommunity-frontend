export async function getUserFullNameApi(){
    const response = await fetch(`http://localhost:8082/calendar/get-user`, {
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