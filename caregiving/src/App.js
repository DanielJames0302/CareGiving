import './App.css';
import { Outlet } from "react-router-dom";
import NavbarMenu from './components/navbar/navbar';

function App() {
  return (
    <div className="App">
      <NavbarMenu />
      <Outlet />
    </div>
  );
}

export default App;
