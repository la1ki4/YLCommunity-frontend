import commentIcon from '@features/Comment/assets/Comment Icon.svg'
import commentStyle from '@features/Comment/styles/comment.module.css'

export function Comment(){
    return(
        <div className={commentStyle.commentBlock}>
            <img src={commentIcon} alt="" className={commentStyle.commentIcon} />
            <span className={commentStyle.commentCount}>4312</span>
        </div>
    );
}