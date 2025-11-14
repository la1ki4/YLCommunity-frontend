export async function uploadPost({description , file}) {
    if(!description && !file){
        throw new Error('All data is missing');
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

    const response = await fetch('http://localhost:8081/post/add', {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });

    if(!response.ok) {
        const errorText = await response.text();
        console.error("Server error", errorText);
        throw new Error(errorText || "Upload failed");
    }

    const contentType = response.headers.get("Content-Type" || "");

    if(contentType.includes("application/json")){
        return await response.json();
    }

    return await response.text();
}