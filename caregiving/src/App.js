import './App.css';
import { Outlet } from "react-router-dom";
import NavbarMenu from './components/navbar/navbar';
import { useDispatch } from 'react-redux'
import { auth } from './firebase/firebase.js'
import { login, logout } from './redux/auth-slice';
import { onAuthStateChanged } from 'firebase/auth'

function App() {
  const dispatch = useDispatch()
  onAuthStateChanged(auth, (user) => {
    if(user) {
      dispatch(login({email: user.email, isAdmin: user.isAdmin}))
    } else {
      dispatch(logout())
    }
  })

  return (
    <div className="App">
      <NavbarMenu />
      <Outlet />
    </div>
  );
}

export default App;
