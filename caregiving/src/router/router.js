import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/login/Login";
import Onboarding from "../pages/onboarding/Onboarding";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/onboarding",
        element: <Onboarding />
      }
    

    ],
  }
]);
export default router;