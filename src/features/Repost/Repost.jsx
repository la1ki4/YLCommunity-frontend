import repostIcon from '@features/Repost/assets/Repost Icon.svg'
import repostStyle from '@features/Repost/styles/repost.module.css'

export function Repost(){
    return(
        <button className={repostStyle.repostButton}>
            <img src={repostIcon} alt="" className={repostStyle.repostIcon} />
            <span className={repostStyle.repostCount}>49</span>                    
        </button>
    );
}