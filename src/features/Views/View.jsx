import viewStyle from '@features/Views/styles/view.module.css'
import viewIcon from '@features/Views/assets/Views Icon.svg'

export function View(){
    return(
        <div className={viewStyle.viewsContainer}>
            <img src={viewIcon} alt="Views Icon" className={viewStyle.viewsIcon}/>
            <span className={viewStyle.viewsCount}>8157</span>
        </div>        
    )
}