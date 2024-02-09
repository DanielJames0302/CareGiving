import './App.css';
import { Outlet } from "react-router-dom";
import NavbarMenu from './components/navbar/navbar';
import { useDispatch } from 'react-redux'
import { auth } from './firebase/firebase.js'
import { login, logout } from './redux/auth-slice';
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase/firebase.js';


function App() {
  const dispatch = useDispatch()

  onAuthStateChanged(auth, async (user) => {
    if(user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        dispatch(login({email: docSnap.data().email, isAdmin: docSnap.data().isAdmin, userId: user.uid, name: docSnap.data().name}))
      } 
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
