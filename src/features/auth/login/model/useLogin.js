import { useState } from "react";
import { loginRequest } from "@features/auth/login/model/loginApi.js";
import useAuth from "@features/auth/model/useAuth.jsx";

export function useLogin(onLoginSuccess) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { checkAuth } = useAuth(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginRequest(formData);
      await checkAuth();
      onLoginSuccess();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return { formData, handleChange, handleSubmit };
}