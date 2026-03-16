import { fetchLikesForPosts } from "@features/feed/serverPostLikesCount.js";
import { fetchCommentCountFromPosts } from "@features/feed/serverPostCommentsCount.js";
import { mergePostMeta } from "@features/feed/model/mergePostMeta.js";

async function fetchFeedPage(page, pageSize) {
    const res = await fetch(
        `http://localhost:8081/post/feed?page=${page}&size=${pageSize}`,
        { credentials: "include" }
    );

    return res.json();
}

async function fetchPostMeta(postIds) {
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
        const data = await fetchFeedPage(page, pageSize);
        const content = data?.content ?? [];

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
