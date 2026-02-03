import {useState} from "react";
import {loginRequest} from "@features/auth/login/model/loginApi.js";
import useAuth from "@features/auth/model/useAuth.jsx";
import {preValidateLogin} from "@features/auth/login/model/preValidation.js";

export function useLogin(onLoginSuccess) {
    const [formData, setFormData] = useState({email: "", password: ""});
    const [errors, setErrors] = useState({ email: [], password: [] });
    const {checkAuth} = useAuth(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setErrors(prev => ({ ...prev, [name]: [] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const errors = await preValidateLogin(formData);

            const nextErrors = { email: [], password: [] };

            errors.forEach(msg => {
                const m = msg.toLowerCase();
                if (m.includes("e-mail")) nextErrors.email.push(msg);
                if (m.includes("password")) nextErrors.password.push(msg);
            });

            setErrors(nextErrors);

            if (nextErrors.email.length || nextErrors.password.length) return;

            await loginRequest(formData);
            await checkAuth();
            onLoginSuccess();
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return {formData, errors, handleChange, handleSubmit};
}