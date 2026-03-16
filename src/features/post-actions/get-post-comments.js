import { getJson } from "@shared/api/httpClient.js";
import { POST_API } from "@shared/config/apiEndpoints.js";

export async function getPostComments(postId) {
    return getJson(`${POST_API}/post/comments?postId=${postId}`);
}
