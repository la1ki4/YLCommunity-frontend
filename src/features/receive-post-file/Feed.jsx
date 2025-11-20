import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {Post} from "@widgets/Posts/Post.jsx";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loaderRef = useRef(null);

    useEffect(() => {
        loadPosts(page);
    }, [page]);

    const loadPosts = async (page) => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axios.get("http://localhost:8081/post/feed", {
                params: { page, size: 5 },
                withCredentials: true
            });

            setPosts(prev => [...prev, ...response.data.content]);

            setHasMore(!response.data.last); // last = true → страниц больше нет
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading]);

    return (
        <div>
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}

            {/* Триггерный элемент */}
            <div ref={loaderRef} style={{ height: 30 }} />

            {loading && <p>Loading...</p>}
        </div>
    );
}
