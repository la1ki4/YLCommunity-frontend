import { createRoot } from "react-dom/client";
import { Header } from '@widgets/Header/Header.jsx'
import '@shared/Logo/styles/logo.module.css'
import '@app/styles/styles.module.css'
import { Main } from '@widgets/Main/Main.jsx'
import mainPageStyle from '@pages/MainPage/styles/mainPage.module.css'

const page = document.getElementById('page')
const root = createRoot(page)
root.render(
    <div className={mainPageStyle.layout}>
        <Header />
        <Main />
    </div>
);