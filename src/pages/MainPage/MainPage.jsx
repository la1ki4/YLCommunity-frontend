import { Header } from '@widgets/Header/Header.jsx'
import '@app/styles/logo.module.css'
import '@app/styles/nullstyle.module.css'
import { Main } from '@widgets/Main/Main.jsx'
import mainPageStyle from '@pages/MainPage/styles/mainPage.module.css'

export default function MainPage(){
    return(
        <div className={mainPageStyle.layout}>
            <Header />
            <Main />
        </div> 
    );
}