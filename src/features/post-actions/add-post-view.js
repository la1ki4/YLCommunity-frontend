export async function addPostView(postId) {
    const res = await fetch(`http://localhost:8081/post/view?postId=${postId}`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to add view");
    }

    return res.json();
}
