import { fetchLikesForPosts } from "@features/feed/serverPostLikesCount.js";
import { fetchCommentCountFromPosts } from "@features/feed/serverPostCommentsCount.js";
import { getJson } from "@shared/api/httpClient.js";
import { POST_API } from "@shared/config/apiEndpoints.js";

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
        const data = await getJson(`${POST_API}/post/feed?page=${page}&size=${pageSize}`);

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
