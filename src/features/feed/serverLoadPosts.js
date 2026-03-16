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

        if (content.length < pageSize) {
            setHasMore(false);
        }

        setPosts((prev) => [...prev, ...content]);

        const postIds = content.map((p) => p.id);
        const { likesByPostId, commentsByPostId } = await fetchPostMeta(postIds);

        setPosts((prev) =>
            prev.map((post) => mergePostMeta(post, likesByPostId, commentsByPostId))
        );
    } finally {
        setIsLoading(false);
    }
}
