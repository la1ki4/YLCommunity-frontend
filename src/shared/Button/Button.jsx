import buttonStyle from '@app/styles/button.module.css'

export function Button({label, type}){
    return(
        <div className={buttonStyle.buttonBlock}>
            <button className={buttonStyle.button} type={type}>{label}</button>
        </div>
    )
} 