export async function getPostComments(postId) {
    const res = await fetch(`http://localhost:8081/post/comments?postId=${postId}`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to load comments");
    }

    // ожидаем массив CommentViewData[]
    return res.json();
}
