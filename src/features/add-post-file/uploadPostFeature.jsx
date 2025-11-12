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
    formData.append("file", file);
    formData.append("description", description);

    const response = await fetch('http://localhost:8081/post/add', {
        method: 'POST',
        body: formData,
    });

    if(!response.ok) {
        throw new Error("Failed to upload post");
    }

    return response.json();
}