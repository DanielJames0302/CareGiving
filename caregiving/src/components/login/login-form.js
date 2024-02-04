import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState} from 'react'
import './login-form.css'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, db} from '../../firebase/firebase.js'
import { useDispatch } from 'react-redux'
import { login, logout } from '../../redux/auth-slice.js';
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [action, setAction] = useState('login')
  const [users, setUsers] = useState({email: '', password: '', isAdmin: false})
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
 
  
  onAuthStateChanged(auth, (user) => {
    if(user) {
      dispatch(login({email: user.email, isAdmin: user.isAdmin}))
      navigate('/home')
    } else {
      dispatch(logout())
    }
  })

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('')
    signInWithEmailAndPassword(auth, users.email, users.password)
      .then((useCredential) => {
        dispatch(login({email: useCredential.user.email, isAdmin: false}))
        navigate('/home')
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
        dispatch(login({email: useCredential.user.email, isAdmin: false}))
        try {
          await addDoc(collection(db, "users"), {
              ...users
          });
        } catch (error) {
          setError(error)
        }
        
        navigate('/home')
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
            <p onClick={handlePasswordReset} className='forgot-password'>Forgot password</p>
     
          </Form>
            
        </div>
        
      </div>
    </div>
    
  )
}

export default LoginForm
