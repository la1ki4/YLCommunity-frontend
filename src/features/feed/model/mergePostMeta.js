export function mergePostMeta(post, likesByPostId, commentsByPostId) {
    const mergedPost = { ...post };

    if (likesByPostId[post.id]) {
        mergedPost.likes = likesByPostId[post.id];
    }

    if (commentsByPostId[post.id]) {
        mergedPost.commentCount = commentsByPostId[post.id].commentCount;
    }

    return mergedPost;
}
