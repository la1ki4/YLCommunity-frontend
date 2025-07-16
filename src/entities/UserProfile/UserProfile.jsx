import headerStyle from '@entities/UserProfile/styles/profile.module.css'
import avatarIcon from '@entities/UserProfile/assets/avatar.jpg'

export function UserProfile(){
    return(
    <a href='#' className={headerStyle.profileSection}>
        <img src={avatarIcon} alt="profile avatar" className={headerStyle.profileAvatar}/>
        <span className={headerStyle.sectionName}>Profile</span>
    </a>
    )
}