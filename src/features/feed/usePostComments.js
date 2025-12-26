import { addPostComment } from "@features/post-actions/post-add-comment.js";
import { getPostComments } from "@features/post-actions/get-post-comments.js";

export function usePostComments(setPosts) {

    const onLoadComments = async (postId) => {
        try {
            const comments = await getPostComments(postId);

            setPosts(prev =>
                prev.map(p =>
                    p.id === postId
                        ? { ...p, comments, commentCount: comments.length }
                        : p
                )
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
                prev.map(p =>
                    p.id === postId
                        ? { ...p, comments, commentCount: comments.length }
                        : p
                )
            );
        } catch (e) {
            console.error("Failed to add comment:", e);
        }
    };

    return {
        onLoadComments,
        onAddComment,
    };
}