import { Header } from '@widgets/Header/Header.jsx'
import '@app/styles/logo.module.css'
import { Main } from '@widgets/Main/Main.jsx'
import mainPageStyle from '@app/styles/mainPage.module.css'
import { Feed } from "@features/receive-post-file/Feed.jsx";

export default function MainPage(){
    return(
        <div className={mainPageStyle.layout}>
            <Header />
            <Main>
                <Feed/>
            </Main>
        </div>
    );
}