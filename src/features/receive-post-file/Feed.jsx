import { useEffect, useState, useRef } from "react";
import { Post } from "@widgets/Posts/Post.jsx";

export function Feed() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const loaderRef = useRef(null);

    const loadPosts = async (page) => {
        if (isLoading) return; // ← защита от двойного вызова
        setIsLoading(true);

        const res = await fetch(`http://localhost:8081/post/feed?page=${page}&size=5`);
        const data = await res.json();

        if (data.content.length < 5) setHasMore(false);

        setPosts(prev => [...prev, ...data.content]);

        setIsLoading(false);
    };

    useEffect(() => {
        loadPosts(page);
    }, [page]);

    useEffect(() => {
        if (!hasMore) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isLoading) {
                setPage(prev => prev + 1);
            }
        });

        const currentLoader = loaderRef.current;

        if (currentLoader) observer.observe(currentLoader);

        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
    }, [hasMore, isLoading]);

    return (
        <>
            {posts.map(post => (
                <Post key={post.id} post={post} />
            ))}
            <div ref={loaderRef} style={{ height: 1 }}></div>
        </>
    );
}
