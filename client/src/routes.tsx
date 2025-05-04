import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import SettingsPage from "./pages/settings-page";
import SignUpPage from "./pages/signup-page";
import ProtectedRoute from "./components/protected-route";
import ProfilePage from "./pages/profile-page";
import GuestRoute from "./components/guest-route";
import NotFoundPage from "./pages/not-found";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <HomePage />,
        path: "/",
      },
      {
        element: <ProfilePage />,
        path: "/profile",
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <LoginPage />,
        path: "/login",
      },
      {
        element: <SignUpPage />,
        path: "/signup",
      },
    ],
  },
  {
    element: <SettingsPage />,
    path: "/settings",
  },
  {
    element: <NotFoundPage />,
    path: "*",
  },
]);
