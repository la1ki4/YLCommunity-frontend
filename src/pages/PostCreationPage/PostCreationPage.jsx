import { Header } from '@widgets/Header/Header.jsx'
import '@app/styles/logo.module.css'
import mainPageStyle from '@app/styles/mainPage.module.css'
import {CreationPostBlock} from "@widgets/CreationPostBlock/CreationPostBlock.jsx";
import {Main} from "@widgets/Main/Main.jsx";

export default function MainPage(){
    return(
        <div className={mainPageStyle.layout}>
            <Header />
            <Main>
                <CreationPostBlock />
            </Main>
        </div>
    );
}