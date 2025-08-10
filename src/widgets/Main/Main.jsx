import mainStyles from '@app/styles/main.module.css'
import { Post } from '@widgets/Posts/Post.jsx'

export function Main(){
    return (
        <main className={mainStyles.main}>
            <div className={mainStyles.mainContent}>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
                <Post/>
            </div>
        </main>
    )
}