import '@app/styles/nullstyle.module.css';
import LoginForm from "@widgets/LoginForm/LoginForm.jsx";

export default function LoginPage({ onLoginSuccess }) {
    return (
        <LoginForm
            inputs={[
                { name: 'email', type: 'text', placeholder: 'Enter your cool username or e-mail 😎' },
                { name: 'password', type: 'password', placeholder: 'Enter your secret password 🤫' }
            ]}
            buttonLabel="Sign In"
            onLoginSuccess={onLoginSuccess}
        />
    );
}