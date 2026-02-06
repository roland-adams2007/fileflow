import { useCookies } from "react-cookie";
import { useAuth } from "../context/Auth/UseAuth";

export function useSaveAuthCookies() {
  const [, setCookie] = useCookies(["__fsession_meta"]);
  const { login } = useAuth();

  return function saveAuthCookies(tokenData, userData) {
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    login(userData);

    setCookie("__fsession_meta", tokenData, {
      path: "/",
      expires: expiryDate,
    });
  };
}
