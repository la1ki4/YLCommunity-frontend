import { useState } from 'react';
import { Logo } from '@shared/Logo/Logo.jsx'
import headerStyle from '@app/styles/header.module.css'
import iconStyle from '@app/styles/icon.module.css'
import textStyle from '@app/styles/text.module.css'
import iconTextStyle from '@app/styles/icon-text.module.css'
import { Menu } from '@widgets/Menu/Menu.jsx'
import { Text } from '@shared/Text/Text.jsx'
import ProfilePopup from '@widgets/Popup/Popup.jsx'
import {IconText} from '@widgets/IconText/IconText.jsx'
import userIcon from '@widgets/Header/assets/avatar.jpg'

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
                    <Text className={`${textStyle.popUpTextBlock} ${textStyle.defaultWhiteText}` } as="a" text="Log out" href="#"/>
                </ProfilePopup>
                <div onClick={togglePopup}>
                <IconText 
                    image={userIcon}
                    href="#"
                    text="Profile"
                    as="a" 
                    imageClass={`${iconStyle.userIcon}`} 
                    textClass={`${textStyle.defaultWhiteText} ${textStyle.leftDistance}`} 
                    wrapperClass={`${iconTextStyle.iconTextBlock} ${iconTextStyle.clickable} ${iconTextStyle.baloonBlock}`}
                />
                </div>
            </div>
        </header>
    )
}