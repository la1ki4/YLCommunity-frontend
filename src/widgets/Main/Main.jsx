import mainStyles from '@app/styles/main.module.css'
import { forwardRef } from "react";

export const Main = forwardRef(function Main({ children }, ref) {
    return (
        <main ref={ref} className={mainStyles.main}>
            {children}
        </main>
    );
});