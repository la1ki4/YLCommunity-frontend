import { Logo } from '@shared/ui/Logo/Logo.jsx'
import headerStyle from '@widgets/Header/styles/header.module.css'
import { Menu } from '@processes/Menu/Menu.jsx'
import { UserProfile } from'@entities/UserProfile/UserProfile.jsx'

export function Header(){
    return(
        <header className={headerStyle.header}>
            <div className={headerStyle.headerContent}>
                <Logo/>
                <Menu/>
                <UserProfile />
            </div>
        </header>
    )
}