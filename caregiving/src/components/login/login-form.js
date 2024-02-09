import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState} from 'react'
import './login-form.css'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth'
import { auth, db} from '../../firebase/firebase.js'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/auth-slice.js';
import { useNavigate } from 'react-router-dom'
import { setDoc, doc } from 'firebase/firestore'


const LoginForm = () => {
  const dispatch = useDispatch()
  const [action, setAction] = useState('login')
  const [users, setUsers] = useState({email: '', password: '', isAdmin: false})
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('')
    signInWithEmailAndPassword(auth, users.email, users.password)
      .then((useCredential) => {
        dispatch(login({email: useCredential.user.email, isAdmin: false, userId: useCredential.user.uid}))
        navigate('/')
      }).catch((error) => {
        setError(error.message)
      })
  }

  const handleSignUpSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (users.password !== confirmPassword) {
      setError('Confirm password is not correct!')
      return
    }
    createUserWithEmailAndPassword(auth, users.email, users.password)
      .then(async (useCredential) => {
        try {
          await setDoc(doc(db, "users", useCredential.user.uid), {
            ...users
          });
          await sendEmailVerification(useCredential.user)
          alert('Email verification request has been sent to you')
          
          dispatch(login({email: useCredential.user.email, isAdmin: false, userId: useCredential.user.uid}))
        } catch (error) {
          setError(error)
        }
        
        navigate('/onboarding')
      }).catch((error) => {
        setError(error.message)
      })
  }
  const handlePasswordReset = () => {
    const email = prompt('Please enter your email');
    sendPasswordResetEmail(auth,email);
    alert('Email sent! Check your email for password reset instructions');
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUsers(prevData => {
      return {
        ...prevData,
        [name]: value
      }
    })
  }
  return (
    <div className="login-form">
      <div className="login-form-wrapper">
        <div className="login-form-nav">
          <button className={action === 'login' ? 'form-btn' : 'form-btn grey'} onClick={() => setAction('login')}>Login</button>
          <button  className={action === 'signup' ? 'form-btn' : 'form-btn grey'} onClick={() => setAction('signup')}>Sign Up</button>
        </div>
        <div className="login-form-content">
          <Form onSubmit={action === 'login' ? handleLoginSubmit : handleSignUpSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name='email' value={users.email}
                onChange={handleInputChange}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name='password' value={users.password} onChange={handleInputChange}/>
            </Form.Group>
            {action === 'signup' ? <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control type="password" placeholder="Password" name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            </Form.Group> : ''}
           
            <Button variant="primary" type='submit'>
              {action === 'login' ? 'Login' : 'Sign Up'}
            </Button>
            <p className='error-message'>{error}</p>
            {action === 'login' ? <p onClick={handlePasswordReset} className='forgot-password'>Forgot password</p> : null }
     
          </Form>
            
        </div>
        
      </div>
    </div>
    
  )
}

export default LoginForm
