import {useEffect} from "react";
import {addPostView} from "@features/post-actions/add-post-view.js"

export function useViewTracker({
                                   postId,
                                   elementRef,
                                   seenSetRef,
                                   onViewResult,
                               }) {
    useEffect(() => {
        const el = elementRef.current;
        if (!el || !postId) return;
        if (seenSetRef.current.has(postId)) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                const entry = entries[0];
                if (!entry.isIntersecting) return;

                if (entry.intersectionRatio >= 0.7) {
                    seenSetRef.current.add(postId);
                    observer.unobserve(el);

                    try {
                        const result = await addPostView(postId);
                        onViewResult?.(postId, result);
                    } catch (e) {
                        console.error("addPostView failed:", e);
                    }
                }
            },
            {threshold: [0.7]}
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [postId, elementRef, seenSetRef, onViewResult]);
}
