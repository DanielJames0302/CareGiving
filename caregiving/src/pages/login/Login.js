import React from 'react'
import LoginForm from '../../components/login/login-form';
import './Login.css'
const Login = () => {
  return (
    <div className='login-page'>
      <div className="login-page-wrapper">
          <LoginForm />
      </div>
    </div>
  )
}

export default Login
