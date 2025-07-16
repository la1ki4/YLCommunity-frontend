import eventsIcon from '@processes/Menu/assets/Events.svg'
import chatIcon from '@processes/Menu/assets/Chat.svg'
import friendsIcon from '@processes/Menu/assets/Friends.svg'
import newPostIcon from '@processes/Menu/assets/New_post.svg'
import notificationIcon from '@processes/Menu/assets/Notification.svg'
import menuStyle from '@processes/Menu/styles/menu.module.css'

export function Menu(){
    return(
        <div className={menuStyle.menu}>
            <a className={menuStyle.section} href="#">
                <img src={eventsIcon}/>
                <span className={menuStyle.sectionName}>Events</span>
            </a>
            <a class={menuStyle.section}  href="#">
                <img src={chatIcon}/>
                <span className={menuStyle.sectionName}>Chat</span>
            </a>
            <a class={menuStyle.section} href="#">
                <img src={friendsIcon}/>
                <span className={menuStyle.sectionName}>Friends</span>
            </a>
            <a class={menuStyle.section}  href="#">
                <img src={notificationIcon}/>
                <span className={menuStyle.sectionName}>Notification</span>
            </a>
            <a class={menuStyle.section}  href="#">
                <img src={newPostIcon}/>
                <span className={menuStyle.sectionName}>New post</span>
            </a>
        </div>
    )
}