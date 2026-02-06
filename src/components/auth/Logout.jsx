import { useEffect, useRef } from "react";
import { useAuth } from "../../context/Auth/UseAuth";

const Logout = () => {
  const { logout } = useAuth();
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      const performLogout = async () => {
        try {
          await logout();
          window.location.href = "/login";
        } catch (error) {
          window.location.href = "/login";
        }
      };

      performLogout();
    }
  }, [logout]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
