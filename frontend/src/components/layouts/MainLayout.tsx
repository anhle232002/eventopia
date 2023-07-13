import { Outlet } from "react-router-dom";
import Footer from "../common/footer";
import Navbar from "../common/Navbar";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
export default MainLayout;
