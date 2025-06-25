import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const isAuthenticated = onLogin(email, password);
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className="login-container">
      {/* Background decorative elements */}
      {/* <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>
      <div className="bg-shape shape-4"></div>
      <div className="bg-shape shape-5"></div> */}
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">
              <div className="check-mark check-1"></div>
              <div className="check-mark check-2"></div>
            </div>
          </div>
          <h2>MEDICARE</h2>
         
        </div>
        
        <div className="login-form">
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="form-input"
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form-input"
            />
          </div>
          
          <button onClick={handleSubmit} className="sign-in-btn">
            Sign in
          </button>
          
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>
          
          <div className="signup-link">
            <span className="signup-text">
              New user? <a href="#" onClick={handleSignupClick} className="signup-link-text">Sign up</a>
            </span>
          </div>


          {/* <div className="signup-link">
            <span className="signup-text">
              New user? <a href="#" className="signup-link-text">Sign-Up</a>
            </span>
          </div> */}
          
          {/* <div className="social-login">
            <div className="social-divider">
              <span>Or sign in with</span>
            </div>
            <div className="social-buttons">
              <button type="button" className="social-btn facebook">
                <span>f</span>
              </button>
              <button type="button" className="social-btn google">
                <span>G</span>
              </button>
              <button type="button" className="social-btn twitter">
                <span>t</span>
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;