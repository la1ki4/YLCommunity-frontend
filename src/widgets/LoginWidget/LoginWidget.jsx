import { useLogin } from "@features/auth/login/model/useLogin.js";
import LoginForm from "@features/auth/login/ui/LoginForm.jsx";

export default function LoginWidget({ onLoginSuccess }) {
    const { handleChange,errors, handleSubmit } = useLogin(onLoginSuccess);
    return (
        <LoginForm
            inputs={[
                { name: 'email', type: 'text', placeholder: 'Enter your incredible e-mail 😎' },
                { name: 'password', type: 'password', placeholder: 'Enter your secret password 🤫' }
            ]}
            buttonLabel="Sign In"
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            errors={errors}
        />
    );
}