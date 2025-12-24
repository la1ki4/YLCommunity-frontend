import { toggleLike } from "@features/post-actions/post-like-toggle.js";

export async function togglePostLike({ postId, setPosts }) {
    try {
        const result = await toggleLike(postId); // { liked, likeCount }

        setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, likes: result } : p))
        );
    } catch (e) {
        console.error(e);
        setPosts((prev) =>
            prev.map((p) => {
                if (p.id !== postId) return p;
                const likedNow = p.likes?.liked ?? false;
                const countNow = p.likes?.likeCount ?? 0;

                return {
                    ...p,
                    likes: {
                        liked: !likedNow,
                        likeCount: likedNow
                            ? Math.max(0, countNow - 1)
                            : countNow + 1,
                    },
                };
            })
        );
    }
}
