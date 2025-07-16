import logoImg from '@shared/assets/images/Logo.svg'
import logoStyle from '@shared/styles/styles.module.css'

export function Logo(){
    return(
        <a href="#">
            <img src={logoImg} className={logoStyle.logo}/>
        </a>
    )
}