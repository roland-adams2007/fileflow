import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function PublicRoute({ children }) {
  const [cookies] = useCookies(["__fsession_meta"]);
  const token = cookies.__fsession_meta;

  if (token) {
    return <Navigate to="/u/file-manager" replace />;
  }

  return children;
}
