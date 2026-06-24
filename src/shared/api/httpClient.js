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

async function sendJson(method, url, body, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    const response = await request(url, {
        method,
        ...options,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    return response.json();
}

export const postJson = (url, body, options) =>
    sendJson("POST", url, body, options);

export const getJson = (url, body, options) =>
    sendJson("GET", url, body, options);

export const putJson = (url, body, options) =>
    sendJson("PUT", url, body, options);

export const patchJson = (url, body, options) =>
    sendJson("PATCH", url, body, options);

export const deleteJson = (url, body, options) =>
    sendJson("DELETE", url, body, options);
