import { getJson } from "@shared/api/httpClient.js";
import { POST_API } from "@shared/config/apiEndpoints.js";

export async function fetchCommentCount(postId) {
    return getJson(`${POST_API}/post/comment-count?postId=${postId}`);
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
