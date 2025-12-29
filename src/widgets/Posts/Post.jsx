import postStyles from '@app/styles/post.module.css'
import postCommentStyles from '@app/styles/post-comment.module.css'
import postOwnerIcon from '@widgets/Posts/assets/John.jpg'
import { IconText } from '@widgets/IconText/IconText.jsx'
import { Text } from '@shared/Text/Text.jsx'
import { Media } from '@shared/Image/Media.jsx'
import { InputField } from '@shared/Input/Input.jsx'
import userIcon from '@widgets/Posts/assets/avatar.jpg'
import LikeIcon from "@widgets/Posts/assets/like.svg?react";
import commentIcon from '@widgets/Posts/assets/comment.svg'
import viewIcon from '@widgets/Posts/assets/Views Icon.svg'
import iconStyle from '@app/styles/icon.module.css'
import textStyle from '@app/styles/text.module.css'
import iconTextStyle from '@app/styles/icon-text.module.css'
import { useViewTracker } from "@features/feed/useViewTracker.js";
import {useRef, useState} from "react";

export function Post({post, onToggleLike, seenViewsRef, onPostViewed, onAddComment, onLoadComments}) {
    const [commentText, setCommentText] = useState("");
    const postRef = useRef(null);
    const [showComments, setShowComments] = useState(false);
    const likeCount = post.likes?.likeCount ?? 0;
    const commentCount = post.commentCount ?? 0;
    const comments = post.comments ?? [];



   useViewTracker({
        postId: post.id,
        elementRef: postRef,
        seenSetRef: seenViewsRef,
        onViewResult: onPostViewed,
    });

    const viewCount = post.views?.viewCount ?? 0;

    const handleCommentsClick = () => {
        setShowComments((prev) => !prev);

        if (!post.comments) {
            onLoadComments?.(post.id);
        }
    };

    return(
    <div ref={postRef} className={postStyles.postContainer}>
        <div className={postStyles.postHeader}>
            <IconText
                as="a"
                href='#'
                image={postOwnerIcon} 
                imageClass={postStyles.postOwnerIcon}
                textClassDirection={postStyles.columnDirection}
                wrapperClass={postStyles.postOwner} 
                text={[post.user.firstName + " " + post.user.lastName, post.user.userRole.roleName]}
                textClass={[postStyles.postOwnerName, postStyles.postOwnerRole]}
            />
        </div>
        <div className={postStyles.postContentContainer}>
            <Media image={post.filePath} alt="Post Media" className={postStyles.postContent} />
        </div>
        <div className={postStyles.postDescriptionContainer}>
            <Text className={postStyles.postDescription} text={post.description} />
        </div>
        <div className={postStyles.postActionsContainer}>
            <div className={postStyles.postActions}>
                <IconText
                    image={
                        <LikeIcon
                            className={`${iconStyle.defaultIconSize} ${iconStyle.actionIcon} ${
                                post.likes?.liked ? iconStyle.liked : ""
                            }`}
                        />
                    }
                    text={String(likeCount)}
                    as="button"
                    type="button"
                    onClick={() => onToggleLike?.(post.id)}
                    textClass={textStyle.defaultWhiteText}
                    wrapperClass={`${iconTextStyle.verticalIconTextBlock} ${iconTextStyle.clickable}`}
                />
                <IconText 
                    image={commentIcon} 
                    text={String(commentCount)}
                    as="button"
                    onClick={handleCommentsClick}
                    imageClass={`${iconStyle.defaultIconSize} ${iconStyle.actionIcon}`}
                    textClass={textStyle.defaultWhiteText} 
                    wrapperClass={`${iconTextStyle.verticalIconTextBlock} ${iconTextStyle.clickable} ${iconTextStyle.leftDistance}`}
                />
            </div>
            <IconText 
                image={viewIcon} 
                text={String(viewCount)}
                as="div" 
                imageClass={`${iconStyle.defaultIconSize} ${iconStyle.rightDistance}`} 
                textClass={textStyle.defaultDarkGreyText} 
                wrapperClass={`${iconTextStyle.iconTextBlock}`}
            />
        </div>
        <div className={postStyles.postInputContainer}>
            <Media image={userIcon} alt="user icon" className={postStyles.userIcon}/>
            <InputField type="text"
                        placeholder='Write a comment . . .'
                        className={postStyles.postInput}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onAddComment?.(post.id, commentText);
                                setCommentText("");
                            }
                        }}/>
        </div>
        {showComments && (
        <div className={postCommentStyles.commentContainer}>
            {comments.map((c) => (
                <div key={c.id} className={postCommentStyles.commentItem}>
                    <IconText
                        image={postOwnerIcon}
                        imageClass={postCommentStyles.postOwnerIcon}
                        textClassDirection={postCommentStyles.columnDirection}
                        wrapperClass={postCommentStyles.postOwner}
                        text={[
                            `${c.author?.firstName ?? ""} ${c.author?.lastName ?? ""}`.trim(),
                            c.author?.roleName ?? ""
                        ]}
                        textClass={[postCommentStyles.postOwnerName, postCommentStyles.postOwnerRole]}
                    />

                    <Text
                        className={postCommentStyles.commentText}
                        text={c.comment ?? ""}
                    />
                </div>
            ))}
        </div>
        )}
    </div>
    );
}