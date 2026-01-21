import mainStyles from '@app/styles/main.module.css'

export function Main({children}) {
    return (
        <main className={mainStyles.main}>
            {children}
        </main>
    )
}