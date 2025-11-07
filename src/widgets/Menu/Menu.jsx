import eventsIcon from '@widgets/Menu/assets/Events.svg'
import chatIcon from '@widgets/Menu/assets/Chat.svg'
import friendsIcon from '@widgets/Menu/assets/Friends.svg'
import newPostIcon from '@widgets/Menu/assets/New_post.svg'
import notificationIcon from '@widgets/Menu/assets/Notification.svg'
import menuStyle from '@app/styles/menu.module.css'
import iconStyle from '@app/styles/icon.module.css'
import textStyle from '@app/styles/text.module.css'
import iconTextStyle from '@app/styles/icon-text.module.css'
import { IconText } from '@widgets/IconText/IconText.jsx'

export function Menu(){
    return(
        <div className={menuStyle.menu}>
            <IconText 
                    image={eventsIcon} 
                    href="#"
                    text="Events"
                    as="a" 
                    imageClass={iconStyle.defaultIconSize} 
                    textClass={`${textStyle.defaultWhiteText} ${textStyle.leftDistance}`} 
                    wrapperClass={`${iconTextStyle.iconTextBlock} ${iconTextStyle.clickable} ${iconTextStyle.baloonBlock}`}
            />
            <IconText 
                    image={chatIcon} 
                    href="#"
                    text="Chat"
                    as="a" 
                    imageClass={iconStyle.defaultIconSize} 
                    textClass={`${textStyle.defaultWhiteText} ${textStyle.leftDistance}`} 
                    wrapperClass={`${iconTextStyle.iconTextBlock} ${iconTextStyle.clickable} ${iconTextStyle.topDistance} ${iconTextStyle.baloonBlock}`}
            />
            <IconText 
                    image={friendsIcon} 
                    href="#"
                    text="Friends"
                    as="a" 
                    imageClass={iconStyle.defaultIconSize} 
                    textClass={`${textStyle.defaultWhiteText} ${textStyle.leftDistance}`} 
                    wrapperClass={`${iconTextStyle.iconTextBlock} ${iconTextStyle.clickable} ${iconTextStyle.topDistance} ${iconTextStyle.baloonBlock}`}
            />
            <IconText 
                    image={notificationIcon} 
                    href="#"
                    text="Notification"
                    as="a" 
                    imageClass={iconStyle.defaultIconSize} 
                    textClass={`${textStyle.defaultWhiteText} ${textStyle.leftDistance}`} 
                    wrapperClass={`${iconTextStyle.iconTextBlock} ${iconTextStyle.clickable} ${iconTextStyle.topDistance} ${iconTextStyle.baloonBlock}`}
            />
            <IconText 
                    image={newPostIcon} 
                    href="/post"
                    text="New Post"
                    as="a" 
                    imageClass={iconStyle.defaultIconSize} 
                    textClass={`${textStyle.defaultWhiteText} ${textStyle.leftDistance}`} 
                    wrapperClass={`${iconTextStyle.iconTextBlock} ${iconTextStyle.clickable} ${iconTextStyle.topDistance} ${iconTextStyle.baloonBlock}`}
            />
        </div>
    )
}