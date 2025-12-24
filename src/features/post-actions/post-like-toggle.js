export async function toggleLike(postId) {
    const res = await fetch(`http://localhost:8081/post/toggle-like?postId=${postId}`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to toggle like");
    }

    return res.json();
}