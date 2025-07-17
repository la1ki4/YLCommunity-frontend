import postStyles from '@post-widget/styles/post.module.css'
import postOwnerIcon from '@post-widget/assets/donik.jpg'
import postPhoto from '@post-widget/assets/postPhoto.jpg'
import { Like } from '@features/Like/Like.jsx'
import { Repost } from '@features/Repost/Repost.jsx'
import { Comment } from '@features/Comment/Comment.jsx'
import { View } from '@features/View/View.jsx'
import userIcon from '@entities/UserProfile/assets/avatar.jpg'

export function Post(){
    return(
    <div className={postStyles.postContainer}>
        <div className={postStyles.postHeader}>
            <a href='#' className={postStyles.postOwner}>
                <img src={postOwnerIcon} alt="post owner" className={postStyles.postOwnerIcon} />
                <div className={postStyles.postOwnerInfo}>
                    <span className={postStyles.postOwnerName}>Никита Доник</span>
                    <span className={postStyles.postOwnerRole}>YL Leader</span>
                </div>
            </a>
            <div className={postStyles.postLocation}>Naslavchea, Young Life base</div>
        </div>
        <div className={postStyles.postContentContainer}>
            <img src={postPhoto} alt="Post Content" className={postStyles.postContent} />
        </div>
        <div className={postStyles.postDescriptionContainer}>
            <span className={postStyles.postDescription}>YOUNG LIFE В НАСЛАВЧЕ, УРА УРА УРА</span>
        </div>
        <div className={postStyles.postActionsContainer}>
            <div className={postStyles.postActions}>
                <Like/>
                <Comment/>
                <Repost/>
            </div>
            <View/>
        </div>
        <div className={postStyles.postAddCommentContainer}>
            <a href="#">
                <img src={userIcon} alt="user icon" className={postStyles.userIcon}/>                
            </a>
            <input type="text" placeholder='Write a comment...' className={postStyles.postAddComment}/>
        </div>
    </div>
    );
}