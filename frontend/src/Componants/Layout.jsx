import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="w-full h-full">
        <Outlet /> {/* This renders the current page */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
