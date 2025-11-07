import logoImg from '@shared/Logo/assets/images/Logo.svg'
import logoStyle from '@app/styles/logo.module.css'

export function Logo(){
    return(
        <a href="/">
            <img src={logoImg} className={logoStyle.logo}/>
        </a>
    )
}