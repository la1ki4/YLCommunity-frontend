import { postJson } from "@shared/api/httpClient.js";
import { AUTH_API } from "@shared/config/apiEndpoints.js";

export async function preValidateLogin(formData) {
    return postJson(`${AUTH_API}/auth/exception`, formData);
}
