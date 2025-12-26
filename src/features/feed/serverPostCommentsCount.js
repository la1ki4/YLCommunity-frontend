export async function fetchCommentCount(postId) {
    const res = await fetch(`http://localhost:8081/post/comment-count?postId=${postId}`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch like count for postId=${postId}`);
    }

    return res.json();
}

export async function fetchCommentCountFromPosts(postIds) {
    const results = await Promise.allSettled(postIds.map(fetchCommentCount));

    const countsByPostId = {};
    results.forEach((r, idx) => {
        const postId = postIds[idx];
        countsByPostId[postId] =
            r.status === "fulfilled" ? r.value : { postId, commentCount: 0 };
    });

    return countsByPostId;
}