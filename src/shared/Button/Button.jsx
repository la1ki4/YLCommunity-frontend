import buttonStyle from '@app/styles/button.module.css'

export function Button({label}){
    return(
        <div className={buttonStyle.buttonBlock}>
            <button className={buttonStyle.button} type="submit">{label}</button>
        </div>
    )
} 