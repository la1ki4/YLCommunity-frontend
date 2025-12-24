export async function fetchLikeCount(postId) {
    const res = await fetch(`http://localhost:8081/post/like-count?postId=${postId}`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch like count for postId=${postId}`);
    }
    return res.json();
}

export async function fetchLikesForPosts(postIds) {
    const results = await Promise.allSettled(postIds.map(fetchLikeCount));

    const likesByPostId = {};
    results.forEach((r, idx) => {
        const postId = postIds[idx];
        likesByPostId[postId] =
            r.status === "fulfilled" ? r.value : {likeCount: 0 };
    });

    return likesByPostId;
}