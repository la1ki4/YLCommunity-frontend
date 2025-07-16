import likeIcon from '@features/Like/assets/Like Icon.svg'
import likeStyle from '@features/Like/styles/like.module.css'

export function Like(){
    return(
        <button className={likeStyle.likeButton}>
            <img src={likeIcon} alt="" className={likeStyle.likeIcon} />
            <span className={likeStyle.likeCount}>4312</span>
        </button>
    );
}