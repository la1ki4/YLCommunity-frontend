import YLFormImageBackground1 from '@features/auth/login/ui/assets/bg1.jpg';
import YLFormImageBackground2 from '@features/auth/login/ui/assets/bg2.jpg';
import YLFormImage from '@features/auth/login/ui/assets/form background.svg';
import loginStyle from '@app/styles/form.module.css';
import inputStyle from '@app/styles/input.module.css'
import textStyle from '@app/styles/text.module.css';

import { Text } from '@shared/Text/Text.jsx';
import { Image } from '@shared/Image/Image.jsx';
import { InputField } from '@shared/Input/Input.jsx';
import { Button } from '@shared/Button/Button.jsx';

const LoginForm = ({ inputs, buttonLabel, handleChange, handleSubmit }) => {

  return (
    <div className={loginStyle.authContainer}>
      <div className={loginStyle.authFormContianer}>
        <Image image={YLFormImageBackground1} className={`${loginStyle.backgroundImage} ${loginStyle.bg1}`} />
        <Image image={YLFormImageBackground2} className={`${loginStyle.backgroundImage} ${loginStyle.bg2}`} />
        <form onSubmit={handleSubmit} className={loginStyle.authFormBlock}>
          <div className={loginStyle.inputContainer}>
            <Text className={textStyle.title} text="Join to our Young Life Community!" />
            <div className={loginStyle.inputBlock}>
              {inputs.map((input) => (
                <InputField
                  key={input.name}
                  name={input.name}
                  type={input.type}
                  placeholder={input.placeholder}
                  onChange={handleChange}
                  className={inputStyle.input}
                />
              ))}
            </div>
          </div>
          <Button label={buttonLabel} type="submit" />
          <div className={loginStyle.additionalLinksBlock}>
            <Text className={loginStyle.additionalLink} as="a" href="#" text="No Account?" />
            <Text className={loginStyle.additionalLink} as="a" href="#" text="Forgot a password?" />
          </div>
          <div className={loginStyle.contentBlock}>
            <Image image={YLFormImage} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;