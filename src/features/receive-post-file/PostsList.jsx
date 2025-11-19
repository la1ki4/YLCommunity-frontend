import { useEffect, useState } from "react";
import { Post } from "@widgets/Posts/Post.jsx";

export function PostsList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function loadPosts() {
            const response = await fetch("http://localhost:8081/post/all", {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();
            setPosts(data);
        }

        loadPosts();
    }, []);

    return (
        <div>
            {posts.map(post => (
                <Post key={post.id} post={post}/>
            ))}
        </div>
    );
}
