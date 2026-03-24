import { request } from "@shared/api/httpClient.js";
import { POST_API } from "@shared/config/apiEndpoints.js";

export async function uploadPost({description , file}) {
    if(!description && !file){
        throw new Error("All data is missing");
    }
    if(!file) {
        throw new Error("No file provided");
    }
    if (!description) {
        throw new Error("No description provided");
    }

    const formData = new FormData();
    formData.append("media", file);
    formData.append("description", description);

    const response = await request(`${POST_API}/post/add`, {
        method: "POST",
        body: formData,
    });

    const contentType = response.headers.get("Content-Type") || "";

    if(contentType.includes("application/json")){
        return response.json();
    }

    return response.text();
}
