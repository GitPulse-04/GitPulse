import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../common/DefaultLayout";
import LoginPage from "../pages/LoginPage";
import OrganizationPage from "../pages/OrganizationPage";
import ProfilePage from "../pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <div>에러</div>,

    // children: [
    //   {
    //     index: true,
    //     path: "/Login",
    //     element: <LoginPage />,
    //   },
    //   {
    //     path: "/organizaiton",
    //     element: <OrganizationPage />,
    //   },
    //   {
    //     path: "/profile",
    //     element: <ProfilePage />,
    //   },
    // ],
  },
  {
    path: "/mygit",
    element: <DefaultLayout />,
    errorElement: <div>에러</div>,
  },
  {
    path: "/organizaiton",
    element: <OrganizationPage />,
    errorElement: <div>에러</div>,
  },
]);
