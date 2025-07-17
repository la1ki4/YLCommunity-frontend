import { useState } from 'react';
import { Logo } from '@shared/Logo/Logo.jsx'
import headerStyle from '@widgets/Header/styles/header.module.css'
import { Menu } from '@processes/Menu/Menu.jsx'
import { UserProfile } from '@entities/UserProfile/UserProfile.jsx'
import ProfilePopup from '@widgets/Popup/Popup.jsx'

export function Header(){
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(prev => !prev);
    };

    return(
        <header className={headerStyle.header}>
            <div className={headerStyle.headerContent}>
                <Logo/>
                <Menu/>
                <ProfilePopup isOpen={isPopupOpen}>
                    <a className={headerStyle.popupText} href="#">Log out</a>
                </ProfilePopup>
                <div onClick={togglePopup}>
                    <UserProfile />
                </div>
            </div>
        </header>
    )
}