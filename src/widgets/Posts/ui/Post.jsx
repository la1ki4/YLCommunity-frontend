import postStyles from '@post-widget/styles/post.module.css'
import postOwnerIcon from '@post-widget/assets/donik.jpg'
import postPhoto from '@post-widget/assets/postPhoto.jpg'
import likeIcon from '@post-widget/assets/Like Icon.svg'
import commentIcon from '@post-widget/assets/Comment Icon.svg'
import repostIcon from '@post-widget/assets/Repost Icon.svg'
import viewsIcon from '@post-widget/assets/Views Icon.svg'
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
                <button className={postStyles.postAction}>
                    <img src={likeIcon} alt="" className={postStyles.postActionIcon} />
                    <span className={postStyles.postActionCount}>4312</span>
                </button>
                <div className={postStyles.postAction}>
                    <img src={commentIcon} alt="" className={postStyles.postActionIcon} />
                    <span className={postStyles.postActionCount}>382</span>
                </div>
                <button className={postStyles.postAction}>
                    <img src={repostIcon} alt="" className={postStyles.postActionIcon} />
                    <span className={postStyles.postActionCount}>49</span>                    
                </button>
            </div>
            <div className={postStyles.postViewsContainer}>
                <img src={viewsIcon} alt="Views Icon" className={postStyles.postViewsIcon}/>
                <span className={postStyles.postViewsCount}>8157</span>
            </div>
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