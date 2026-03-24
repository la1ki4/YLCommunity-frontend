async function parseResponseError(response) {
    const contentType = response.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
        const data = await response.json().catch(() => null);

        if (!data) return "Request failed";
        if (typeof data === "string") return data;
        if (typeof data.message === "string") return data.message;
        if (typeof data.error === "string") return data.error;

        return JSON.stringify(data);
    }

    return (await response.text().catch(() => "")) || "Request failed";
}

export async function request(url, options = {}) {
    const response = await fetch(url, {
        credentials: "include",
        ...options,
    });

    if (!response.ok) {
        const message = await parseResponseError(response);
        throw new Error(message);
    }

    return response;
}

export async function getJson(url, options = {}) {
    const response = await request(url, {
        method: "GET",
        ...options,
    });

    return response.json();
}

export async function postJson(url, body, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    const response = await request(url, {
        method: "POST",
        ...options,
        headers,
        body: JSON.stringify(body),
    });

    return response.json();
}
