import postStyles from '@app/styles/post.module.css'
import postOwnerIcon from '@post-widget/assets/donik.jpg'
import postPhoto from '@post-widget/assets/postPhoto.jpg'
import { IconText } from '@widgets/IconText/IconText.jsx'
import { Text } from '@shared/Text/Text.jsx'
import { Image } from '@shared/Image/Image.jsx'
import { InputField } from '@shared/Input/Input.jsx'
import userIcon from '@widgets/Posts/assets/avatar.jpg'
import likeIcon from '@widgets/Posts/assets/like.svg'
import commentIcon from '@widgets/Posts/assets/comment.svg'
import repostIcon from '@widgets/Posts/assets/repost.svg'
import viewIcon from '@widgets/Posts/assets/Views Icon.svg'
import iconStyle from '@app/styles/icon.module.css'
import textStyle from '@app/styles/text.module.css'
import iconTextStyle from '@app/styles/icon-text.module.css'

export function Post(){
    return(
    <div className={postStyles.postContainer}>
        <div className={postStyles.postHeader}>
            <IconText
                as="a"
                href='#' 
                image={postOwnerIcon} 
                imageClass={postStyles.postOwnerIcon}
                textClassDirection={postStyles.columnDirection}
                wrapperClass={postStyles.postOwner} 
                text={["Никита Доник", "YL Leader"]}
                textClass={[postStyles.postOwnerName, postStyles.postOwnerRole]}
            />
            <Text className={postStyles.postLocation} text="Naslavchea, Young Life base"/>
        </div>
        <div className={postStyles.postContentContainer}>
            <Image image={postPhoto} alt="Post Content" className={postStyles.postContent} />
        </div>
        <div className={postStyles.postDescriptionContainer}>
            <Text className={postStyles.postDescription} text ="YOUNG LIFE В НАСЛАВЧЕ, УРА УРА УРА"/>
        </div>
        <div className={postStyles.postActionsContainer}>
            <div className={postStyles.postActions}>
                <IconText 
                    image={likeIcon} 
                    text="2419"
                    as="button" 
                    imageClass={iconStyle.defaultIconSize} 
                    textClass={textStyle.defaultWhiteText} 
                    wrapperClass={`${iconTextStyle.verticalIconTextBlock} ${iconTextStyle.clickable}`}
                />
                <IconText 
                    image={commentIcon} 
                    text="321"
                    as="div" 
                    imageClass={iconStyle.defaultIconSize} 
                    textClass={textStyle.defaultWhiteText} 
                    wrapperClass={`${iconTextStyle.verticalIconTextBlock} ${iconTextStyle.leftDistance}`}
                />
                <IconText 
                    image={repostIcon} 
                    text="32"
                    as="button" 
                    imageClass={iconStyle.defaultIconSize} 
                    textClass={textStyle.defaultWhiteText} 
                    wrapperClass={`${iconTextStyle.verticalIconTextBlock} ${iconTextStyle.leftDistance} ${iconTextStyle.clickable}`}
                />
            </div>
            <IconText 
                image={viewIcon} 
                text="8423"
                as="div" 
                imageClass={`${iconStyle.defaultIconSize} ${iconStyle.rightDistance}`} 
                textClass={textStyle.defaultDarkGreyText} 
                wrapperClass={`${iconTextStyle.iconTextBlock}`}
            />
        </div>
        <div className={postStyles.postAddCommentContainer}>
            <Image image={userIcon} alt="user icon" className={postStyles.userIcon}/> 
            <InputField type="text" placeholder='Write a comment...' className={postStyles.postAddComment}/>
        </div>
    </div>
    );
}