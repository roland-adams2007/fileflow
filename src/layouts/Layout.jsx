import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="bg-[#0f172a] text-gray-100  h-screen">
      <div className="flex h-full main-container">
        <Sidebar />

        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
