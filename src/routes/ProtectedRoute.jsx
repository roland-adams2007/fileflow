import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function ProtectedRoute() {
  const [cookies] = useCookies(["__fsession_meta"]);
  const token = cookies.__fsession_meta;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
