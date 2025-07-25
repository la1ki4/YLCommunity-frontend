import titleStyle from '@app/styles/title.module.css'

export function Title({text}){
    return(
        <span className={titleStyle.inputTitle}>{text}</span>
    )
}