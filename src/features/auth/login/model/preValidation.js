export async function preValidateLogin(formData) {
    const response = await fetch("http://localhost:8080/auth/exception", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Pre-validation failed");
    }

    return response.json();
}
