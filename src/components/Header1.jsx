import { useEffect, useState } from "react";
// import { CiSearch } from "react-icons/ci";
import Sidebar from "./Sidebar";
import ProductsDropdown from "./ProductsDropdown";
import ApplicationDropdown from "./ApplicationDropdown";
import { Link } from "react-router-dom";

const Header1 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state
  const [isVisible, setIsVisible] = useState(true); // Track header visibility
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
  const [isHoveringTop, setIsHoveringTop] = useState(false); // Detect hover on top of page

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
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
        className={`fixed w-full px-5 lg:px-10 h-[62px] z-40 bg-opacity-90 backdrop-blur-lg transition-all duration-300 ${
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
          <div className="lg:flex gap-12 items-center hidden">
            <div className="flex relative border border-black rounded-md ">
              <button
                className={`text-xs font-semibold py-2 px-8 border-r border-black h-full text-black`}
              >
                Browse By Applications
              </button>
              <ApplicationDropdown color="black" />
            </div>
            {/* <div className="cursor-pointer">
              <CiSearch className="text-black text-lg" />
            </div> */}
          </div>
        </div>
      </header>

      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header1;
