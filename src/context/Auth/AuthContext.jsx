import { createContext, useState, useRef, useEffect } from "react";
import axiosInstance from "../../api/axiosinstance";
import { Cookies } from "react-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const cookies = new Cookies();
  const hasFetchedUser = useRef(false);
  const failedAttemptsRef = useRef(0);

  const fetchUserDetails = async () => {
    if (user) return;
    try {
      setLoadingUser(true);
      const { data } = await axiosInstance.get("/users/current");
      if (data?.data) {
        setUser(data.data);
        failedAttemptsRef.current = 0;
      } else {
        setUser(null);
        handleFailedAttempt();
      }
    } catch (err) {
      console.error(err);
      setUser(null);
      handleFailedAttempt();
    } finally {
      hasFetchedUser.current = true;
      setLoadingUser(false);
    }
  };

  const handleFailedAttempt = () => {
    failedAttemptsRef.current += 1;

    if (failedAttemptsRef.current >= 3) {
      console.warn(
        "Clearing session token due to 3 consecutive failed profile fetch attempts",
      );
      cookies.remove("__fsession_meta");
      delete axiosInstance.defaults.headers.common["Authorization"];
      failedAttemptsRef.current = 0;

      setUser(null);
      hasFetchedUser.current = false;
    }
  };

  const login = (userData) => {
    setUser(userData);
    failedAttemptsRef.current = 0;
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch (err) {
    } finally {
      setUser(null);
      cookies.remove("__fsession_meta");
      hasFetchedUser.current = false;
      delete axiosInstance.defaults.headers.common["Authorization"];
      failedAttemptsRef.current = 0;
    }
  };

  useEffect(() => {
    const token = cookies.get("__fsession_meta");

    if (token && !hasFetchedUser.current) {
      fetchUserDetails();
    } else if (!token) {
      setUser(null);
      failedAttemptsRef.current = 0;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loadingUser,
        fetchUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
