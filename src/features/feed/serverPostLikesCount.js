import { getJson } from "@shared/api/httpClient.js";
import { POST_API } from "@shared/config/apiEndpoints.js";

export async function fetchLikeCount(postId) {
    return getJson(`${POST_API}/post/like-count?postId=${postId}`);
}

export async function fetchLikesForPosts(postIds) {
    const results = await Promise.allSettled(postIds.map(fetchLikeCount));

    const likesByPostId = {};
    results.forEach((r, idx) => {
        const postId = postIds[idx];
        likesByPostId[postId] =
            r.status === "fulfilled" ? r.value : { likeCount: 0 };
    });

    return likesByPostId;
}
