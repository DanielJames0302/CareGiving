import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/login/Login";
import Onboarding from "../pages/onboarding/Onboarding";
import HomePage from "../pages/home/home";
import Activity from "../pages/activity/activity";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage/>
      },
      {

        path: "/login",
        element: <Login />
      },
      {
        path: "/onboarding",
        element: <Onboarding />
      },
      {
        path: "/volunteer/1",
        element: <Activity />
      }

    ],
  }
]);
export default router;