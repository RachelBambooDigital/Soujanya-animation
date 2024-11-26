import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Sidebar from "./Sidebar";
import Sidebar2 from "./Sidebar2";
import ApplicationDropdown from "./ApplicationDropdown";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header1 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state
  const [isSidebar2Open, setIsSidebar2Open] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Track header visibility
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
  const [isHoveringTop, setIsHoveringTop] = useState(false); // Detect hover on top of page
  const navigate = useNavigate(); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  const toggleSidebar2 = () => {
    setIsSidebar2Open(!isSidebar2Open);
  };

  // Redirect functions
  const handleContactUs = () => {
    navigate('/contact-us');
  };

  const controlHeaderVisibility = () => {
    if (window.scrollY > lastScrollY && !isHoveringTop) {
      setIsVisible(false); // Hide header when scrolling down
    } else {
      setIsVisible(true); // Show header when scrolling up or hovering on top
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlHeaderVisibility);
    return () => {
      window.removeEventListener("scroll", controlHeaderVisibility);
    };
  }, [lastScrollY, isHoveringTop]);

  // Handle hover event for the top area
  const handleMouseEnterTop = () => {
    setIsHoveringTop(true);
    setIsVisible(true);
  };

  const handleMouseLeaveTop = () => {
    setIsHoveringTop(false);
  };

  return (
    <>
      {/* Transparent hoverable area at the top of the page */}
      <div
        onMouseEnter={handleMouseEnterTop}
        onMouseLeave={handleMouseLeaveTop}
        className="fixed top-0 left-0 w-full h-[20px] z-50"
      ></div>
      <header
        className={`fixed w-full px-5 lg:px-10 h-[62px] z-40 transition-all duration-300 bg-white ${
          isVisible ? "top-0" : "-top-[62px]"
        }`}
      >
        <div className="w-full flex items-center justify-between h-full">
          <div className="text-white flex items-center gap-5">
            <div>
              <button className="w-8" onClick={toggleSidebar}>
                <img src="/logos/menuBlack.png" alt="menu" />
              </button>
            </div>
            <Link to="/">
              <img
                src="/logos/NavLogoBlack.svg"
                className="w-40 pt-1"
                alt="logo"
              />
            </Link>
          </div>
          <div className="lg:flex gap-5 items-center hidden">
              {/* <div className="flex relative border border-white rounded-md">
                <ApplicationDropdown color="white" />
              </div> */}
              <div className="flex relative border rounded-md">
                <button className={`text-xs font-semibold py-2 px-4 h-full text-black`}>
                  Eng
                </button>
              </div>
              <div className="flex relative border rounded-md">
                <button className={`text-xs font-semibold py-2 px-4 h-full text-black`} onClick={handleContactUs}>
                  Contact
                </button>
              </div>
              <div className="flex relative border rounded-md">
              <button
                className={`text-xs font-semibold py-2 px-4 h-full text-black`}  
                onClick={toggleSidebar2}>
                <CiSearch className="text-black text-lg" />
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

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md z-40">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
      )}

      {/* <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> */}
    </>
  );
};

export default Header1;
