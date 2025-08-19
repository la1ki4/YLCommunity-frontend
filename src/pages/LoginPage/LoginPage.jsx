import LoginWidget from "@widgets/LoginWidget/LoginWidget.jsx";
export default function LoginPage({onLoginSuccess}) {
  return (
      <LoginWidget onLoginSuccess={onLoginSuccess}/>
  );
}