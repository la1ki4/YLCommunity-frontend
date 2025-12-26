import { fetchLikesForPosts } from "@features/feed/serverPostLikesCount.js";
import { fetchCommentCountFromPosts } from "@features/feed/serverPostCommentsCount.js";

export async function serverLoadPosts({
                                    page,
                                    pageSize = 5,
                                    isLoading,
                                    setIsLoading,
                                    setHasMore,
                                    setPosts,
                                }) {
    if (isLoading) return;
    setIsLoading(true);

    try {
        const res = await fetch(
            `http://localhost:8081/post/feed?page=${page}&size=${pageSize}`,
            { credentials: "include" }
        );
        const data = await res.json();

        if (data.content.length < pageSize) {
            setHasMore(false);
        }

        const newPosts = data.content;
        setPosts((prev) => [...prev, ...newPosts]);

        const postIds = newPosts.map((p) => p.id);
        const likesByPostId = await fetchLikesForPosts(postIds);
        const commentsByPostId = await fetchCommentCountFromPosts(postIds);

        setPosts((prev) =>
            prev.map((p) => ({
                ...p,
                ...likesByPostId[p.id] ? { ...p, likes: likesByPostId[p.id]} : p,
                ...(commentsByPostId[p.id] ? { commentCount: commentsByPostId[p.id].commentCount } : {}),
            }))
        );
    } finally {
        setIsLoading(false);
    }
}
