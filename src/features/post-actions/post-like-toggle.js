import { postJson } from "@shared/api/httpClient.js";
import { POST_API } from "@shared/config/apiEndpoints.js";

export async function toggleLike(postId) {
    return postJson(`${POST_API}/post/toggle-like?postId=${postId}`);
}
