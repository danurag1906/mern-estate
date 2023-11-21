import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  //if currentUser is logged in we show profile which is a protected route in this case and is accessed via Outlet , else we will Navigate the user to sign-in page.
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
