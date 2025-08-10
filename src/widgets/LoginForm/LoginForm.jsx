import YLFormImageBackground1 from '@widgets/LoginForm/assets/bg1.jpg';
import YLFormImageBackground2 from '@widgets/LoginForm/assets/bg2.jpg';
import YLFormImage from '@widgets/LoginForm/assets/form background.svg';
import loginStyle from '@app/styles/form.module.css';
import inputStyle from '@app/styles/input.module.css'
import textStyle from '@app/styles/text.module.css';

import { useNavigate } from 'react-router-dom';
import { Text } from '@shared/Text/Text.jsx';
import { Image } from '@shared/Image/Image.jsx';
import { InputField } from '@shared/Input/Input.jsx';
import { Button } from '@shared/Button/Button.jsx';

import { useState } from 'react';

const LoginForm = ({ inputs, buttonLabel }) => {

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(
    Object.fromEntries(inputs.map(input => [input.name, '']))
  );

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try{
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: "include"
      });
      
      if(response.ok){
        navigate('/main');
      }
      else{
        throw new Error('Response error!')
      }

      const data = await response.json();
      localStorage.setItem("jwt", data.token);
      console.log(data.token);
    } 
    catch(error){
      console.error("Data send error: ", error);
    }
  };

  return (
    <div className={loginStyle.authContainer}>
      <div className={loginStyle.authFormContianer}>
        <Image image={YLFormImageBackground1} className={`${loginStyle.backgroundImage} ${loginStyle.bg1}`} />
        <Image image={YLFormImageBackground2} className={`${loginStyle.backgroundImage} ${loginStyle.bg2}`} />
        <form onSubmit={handleSubmit} className={loginStyle.authFormBlock}>
          <div className={loginStyle.inputContainer}>
            <Text className={textStyle.title} text="Join to our Young Life Community!" />
            <div className={loginStyle.inputBlock}>
              {inputs.map((input, index) => (
                <InputField
                  key={index}
                  name={input.name}
                  type={input.type}
                  placeholder={input.placeholder}
                  value={formData[input.name]}
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