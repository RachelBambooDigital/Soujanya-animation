import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Sidebar from "./Sidebar";
import Sidebar2 from "./Sidebar2";
import ApplicationDropdown from "./ApplicationDropdown";
import { Link } from "react-router-dom";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebar2Open, setIsSidebar2Open] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebar2 = () => {
    setIsSidebar2Open(!isSidebar2Open);
  };

  return (
    <>

      <header
        className={`fixed w-full px-5 lg:px-10 h-[62px] z-40 bg-opacity-90 backdrop-blur-lg transition-all duration-300`}>
        <div className="w-full flex items-center justify-between h-full">
          <div className="text-white flex items-center gap-5">
            <button className="w-8" onClick={toggleSidebar}>
              <img src="/logos/menu.png" alt="menu" />
            </button>
            <Link to="/">
              <img src="/logos/NavLogoWhite.svg" className="w-40" alt="logo" />
            </Link>
          </div>
          <div className="lg:flex gap-5 items-center hidden">
            <div className="flex relative border border-white rounded-md">
                <ApplicationDropdown color="white" />
              </div>
              <div className="flex relative border border-white rounded-md">
                <button className={`text-xs font-semibold py-2 px-4 border-r border-white h-full text-white`}>
                  Eng
                </button>
              </div>
              <div className="flex relative border border-white rounded-md">
                <button className={`text-xs font-semibold py-2 px-4 border-r border-white h-full text-white`}>
                  Contact
                </button>
              </div>
              <div className="flex relative border border-white rounded-md">
              <button
                className={`text-xs font-semibold py-2 px-4 border-r border-white h-full text-white`}  
                onClick={toggleSidebar2}>
                <CiSearch className="text-white text-lg" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebar2Open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-40">
          <Sidebar2 isOpen={isSidebar2Open} toggleSidebar2={toggleSidebar2} />
        </div>
      )}

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header;
