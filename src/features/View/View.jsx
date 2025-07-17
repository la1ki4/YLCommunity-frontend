import viewStyle from '@features/View/styles/view.module.css'
import viewIcon from '@features/View/assets/Views Icon.svg'

export function View(){
    return(
        <div className={viewStyle.viewsContainer}>
            <img src={viewIcon} alt="Views Icon" className={viewStyle.viewsIcon}/>
            <span className={viewStyle.viewsCount}>8157</span>
        </div>        
    )
}