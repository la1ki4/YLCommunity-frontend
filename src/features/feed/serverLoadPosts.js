import { fetchLikesForPosts } from "@features/feed/serverPostLikesCount.js";
import { fetchCommentCountFromPosts } from "@features/feed/serverPostCommentsCount.js";
import { mergePostMeta } from "@features/feed/model/mergePostMeta.js";
import { getJson } from "@shared/api/httpClient.js";
import { POST_API } from "@shared/config/apiEndpoints.js";

function extractFeedContent(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;

    return [];
}

async function fetchPostMeta(postIds) {
    if (postIds.length === 0) {
        return { likesByPostId: {}, commentsByPostId: {} };
    }

    const [likesByPostId, commentsByPostId] = await Promise.all([
        fetchLikesForPosts(postIds),
        fetchCommentCountFromPosts(postIds),
    ]);

    return { likesByPostId, commentsByPostId };
}

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
        const content = extractFeedContent(data);

        if (content.length < pageSize) {
            setHasMore(false);
        }

        const postIds = content.map((post) => post.id);
        const { likesByPostId, commentsByPostId } = await fetchPostMeta(postIds);
        const preparedPosts = content.map((post) =>
            mergePostMeta(post, likesByPostId, commentsByPostId)
        );

        setPosts((prev) => [...prev, ...preparedPosts]);
    } finally {
        setIsLoading(false);
    }
}
