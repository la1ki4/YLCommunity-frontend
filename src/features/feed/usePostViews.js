import { useRef } from 'react';

export function usePostViews(setPosts) {
    const seenViewsRef = useRef(new Set());

    const onPostViewed = (postId, result) => {
        setPosts(prev =>
            prev.map(p =>
                p.id === postId ? { ...p, views: result } : p
            )
        );
    };

    return {
        seenViewsRef,
        onPostViewed
    };
}
