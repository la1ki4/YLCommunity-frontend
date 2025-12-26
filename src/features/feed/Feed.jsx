import { useEffect, useRef, useState } from "react";
import { Post } from "@widgets/Posts/Post.jsx";
import { serverLoadPosts } from "@features/feed/serverLoadPosts.js";
import { togglePostLike } from "@features/feed/togglePostLike.js";
import { addPostComment } from "@features/post-actions/post-add-comment.js";
import { getPostComments } from "@features/post-actions/get-post-comments.js";

export function Feed() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const loaderRef = useRef(null);

    const onLoadComments = async (postId) => {
        try {
            const comments = await getPostComments(postId);

            setPosts(prev =>
                prev.map(p => (p.id === postId ? { ...p, comments } : p))
            );
        } catch (e) {
            console.error("Load comments failed:", e);
        }
    };

    const onAddComment = async (postId, text) => {
        if (!text.trim()) return;

        try {
            await addPostComment({ postId, comment: text });

            const comments = await getPostComments(postId);

            setPosts(prev =>
                prev.map(p => (p.id === postId ? { ...p, comments } : p))
            );
        } catch (e) {
            console.error("Failed to add comment:", e);
        }
    };

    useEffect(() => {
        serverLoadPosts({
            page,
            pageSize: 5,
            isLoading,
            setIsLoading,
            setHasMore,
            setPosts,
        });
    }, [page]);

    useEffect(() => {
        if (!hasMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading) {
                setPage((prev) => prev + 1);
            }
        });

        const node = loaderRef.current;
        if (node) observer.observe(node);

        return () => {
            if (node) observer.unobserve(node);
        };
    }, [hasMore, isLoading]);

    return (
        <>
            {posts.map((post) => (
                <Post
                    key={post.id}
                    post={post}
                    onToggleLike={(postId) =>
                        togglePostLike({ postId, setPosts })
                    }
                    onAddComment={onAddComment}
                    onLoadComments={onLoadComments}
                />
            ))}
            <div ref={loaderRef} style={{ height: 1 }} />
        </>
    );
}
