import {postJson} from "@shared/api/httpClient.js";
import {AUTH_API} from "@shared/config/apiEndpoints.js";

export async function logoutRequest() {
    return postJson(`${AUTH_API}/auth/logout`);
}