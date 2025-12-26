export async function addPostComment({ postId, comment }) {
    const res = await fetch("http://localhost:8081/post/add-comment", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, comment }),
    });

    if (!res.ok) throw new Error("Failed to add comment");
    return res.json();
}
