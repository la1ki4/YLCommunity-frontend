import YLFormImageBackground1 from '@widgets/LoginForm/assets/bg1.jpg'
import YLFormImageBackground2 from '@widgets/LoginForm/assets/bg2.jpg'
import YLFormImage from '@widgets/LoginForm/assets/form background.svg'
import loginStyle from '@app/styles/form.module.css'
import { Text } from '@shared/Text/Text.jsx'
import textStyle from '@app/styles/text.module.css'
import { Image } from '@shared/Image/Image.jsx'

const Form = ({ formInputs, authButton }) => {
  return (
    <div className={loginStyle.authContainer}>
      <div className={loginStyle.authFormContianer}>
        <Image image={YLFormImageBackground1} className={`${loginStyle.backgroundImage} ${loginStyle.bg1}`}/>
        <Image image={YLFormImageBackground2} className={`${loginStyle.backgroundImage} ${loginStyle.bg2}`}/>
        <div className={loginStyle.authFormBlock}>
          <div className={loginStyle.inputContainer}>
            <Text className={textStyle.title} text="Join to our Young Life Community!"/>
            <div className={loginStyle.inputBlock}>
              {formInputs.map((input, index) => (
                  <div key={index}>{input}</div>
                ))}
            </div>
          </div>
          {authButton}
          <div className={loginStyle.additionalLinksBlock}>
            <Text className={loginStyle.additionalLink} as="a" href="#" text="No Account?"/>  
            <Text className={loginStyle.additionalLink} as="a" href="#"  text="Forgot a password?"/>  
          </div>
          <div className={loginStyle.contentBlock}>
            <Image image={YLFormImage}/>
          </div>       
        </div>
      </div>
    </div>
  );
};

export default Form;