import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../store/user-store";

const GuestRoute = () => {
  const isAuth = useUserStore((state) => state.isAuth);
  console.log(isAuth)
  return !isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default GuestRoute;
