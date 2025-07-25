import { createRoot } from "react-dom/client";
import '@app/styles/nullstyle.module.css'
import inputStyle from '@app/styles/input.module.css'
import LoginForm from "@widgets/LoginForm/LoginForm.jsx";
import { InputField } from "@shared/Input/Input.jsx"
import { Button } from "@shared/Button/Button.jsx"

const page = document.getElementById('page')
const root = createRoot(page)
root.render(
    <LoginForm formInputs={
            [
                <InputField className={inputStyle.input} type="text" placeholder="Enter your cool username or e-mail 😎"/>,
                <InputField className={inputStyle.input} type="password" placeholder="Enter your secret password 🤫"/>
            ]
        }
        authButton={
            <Button label="Sign In"/>
        }
    />
);