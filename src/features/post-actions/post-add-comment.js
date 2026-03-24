import { postJson } from "@shared/api/httpClient.js";
import { POST_API } from "@shared/config/apiEndpoints.js";

export async function addPostComment({ postId, comment }) {
    return postJson(`${POST_API}/post/add-comment`, { postId, comment });
}
