import Sidebar from "../common/Sidebar.jsx";
import Rightbar from "../common/Rightbar.jsx";
import { Outlet } from "react-router-dom";  
const MainLayout = () => {
  return (
    <div className="flex mx-auto max-w-6xl">
      <Sidebar />
      <div className="flex-1"> 
        <Outlet />
      </div>
      <Rightbar />
    </div>
  );
};

export default MainLayout;