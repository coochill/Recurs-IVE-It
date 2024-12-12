import React, { useState } from 'react';
import Login from './login'; 
import SignUp from './signup'; 
import './authpage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isLogin ? '' : 'auth-container--signup'}`}>
        <div className="image-wrapper">
          <div className="img">
            <div className="img__text m--up">
              <h2>Don't have an account?</h2>
              <p>Sign up and discover great opportunities!</p>
            </div>
            <div className="img__text m--in">
              <h2>One of us?</h2>
              <p>If you already have an account, just sign in. We've missed you!</p>
            </div>
            <div className="img__btn" onClick={toggleForm}>
              <span className={isLogin ? 'm--up' : 'm--in'}>Sign Up</span>
              <span className={isLogin ? 'm--in' : 'm--up'}>Sign In</span>
            </div>
          </div>
        </div>
        <div className={`slide-container ${isLogin ? 'slide-login' : 'slide-signup'}`}>
          {isLogin ? <Login /> : <SignUp />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;