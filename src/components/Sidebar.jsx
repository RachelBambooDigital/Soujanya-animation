import { useState, useEffect, useRef } from "react";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
  MdAdd,
  MdRemove,
} from "react-icons/md";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const sidebarRef = useRef(null); // Reference for the sidebar

  const handleMenuClick = (menu) => {
    setActiveMenu(menu === activeMenu ? null : menu); // Toggle main menu visibility
    setActiveSubMenu(null); // Reset the submenu when switching main menus
  };

  const handleSubMenuClick = (submenu, event) => {
    event.stopPropagation(); // Prevent triggering parent click events
    setActiveSubMenu(submenu === activeSubMenu ? null : submenu); // Toggle submenu visibility
  };

  // Calculate sidebar width based on active sections
  const sidebarWidth =
    520 * (1 + (activeMenu ? 1 : 0) + (activeSubMenu ? 1 : 0));

  // Effect to handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar(); // Close the sidebar if the click is outside
      }
    };

    // Add event listener
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full bg-white z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out overflow-y-scroll custom-scroll`}
      style={{ width: `${sidebarWidth}px`, maxWidth: "90vw" }} // Max width is 90% of viewport
    >
      <div className="w-full h-full flex flex-col gap-16">
        {/* Header */}
        <div className="w-full px-5 lg:px-10 h-[62px] z-40 bg-opacity-90 backdrop-blur-lg transition-all duration-300">
          <div className="w-full flex items-center justify-between h-full py-10">
            <div className="text-black flex items-center gap-5">
              <button className="w-5" onClick={toggleSidebar}>
                <img src="/logos/close.png" alt="close" />
              </button>
              <Link to="/">
                <img
                  src="/logos/NavLogoBlack.svg"
                  className="w-40"
                  alt="logo"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Menu Layout */}
        <div className="relative flex flex-col lg:flex-row px-5 lg:px-20 w-full gap-5 lg:gap-20">
          {/* First Column: Main Menu */}
          <div className="flex-grow basis-[500px] pr-4">
            <nav className="flex flex-col gap-2 font-subHeading text-[14px] lg:text-[18px] leading-[150%] text-black">
              {/* About Us */}
              <Link to="/about-us">
                <div
                  onClick={toggleSidebar}
                  className="flex items-center justify-between py-2 px-5 border-b border-black"
                >
                  <p>About Us</p>
                </div>
              </Link>

              {/* What We Offer Menu */}
              <div
                className="flex items-center justify-between py-2 px-5 border-b border-black cursor-pointer"
                onClick={() => handleMenuClick("offer")}
              >
                <p>What we offer</p>
                {activeMenu === "offer" ? (
                  <MdOutlineKeyboardArrowRight className="text-2xl" />
                ) : (
                  <MdOutlineKeyboardArrowRight className="text-2xl" />
                )}
              </div>

              {/* LG hidden */}
              {/* Submenu for "What we offer" */}
              {activeMenu === "offer" && (
                <div className="lg:hidden flex flex-col gap-2 font-subHeading text-[14px] lg:text-[18px] leading-[150%] text-black pl-2">
                  <div className="flex items-center justify-between py-2 px-5 border-b border-black cursor-pointer">
                    <Link to="/coatings-inks" className="flex-grow" onClick={toggleSidebar}>
                      <p>Coatings and Inks</p>
                    </Link>
                    <div onClick={(e) => handleSubMenuClick("coatings", e)}>
                      {activeSubMenu === "coatings" ? (
                        <MdRemove className="text-2xl" />
                      ) : (
                        <MdAdd className="text-2xl" />
                      )}
                    </div>
                  </div>
                  {activeSubMenu === "coatings" && (
                    <div className="flex flex-col pl-5">
                      <Link
                        to="/productDet2/7377553227842"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>I-TINT</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet2/7377753079874"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Hydratint</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet2/7377753309250"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Smartint</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet2/7377753505858"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Tintol</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet2/7377753669698"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Blend</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet2/7377753866306"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Ultratint</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet2/7377754030146"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Walltint</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet2/7377754128450"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Aquaflexo</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet2/7377754488898"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Colorcomposit</p>
                        </div>
                      </Link>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 px-5 border-b border-black cursor-pointer">
                    <Link to="/home-care-cosmetics" className="flex-grow" onClick={toggleSidebar}>
                      <p>Home, Personal Care & Cosmetics</p>
                    </Link>
                    <div onClick={(e) => handleSubMenuClick("personalCare", e)}>
                      {activeSubMenu === "personalCare" ? (
                        <MdRemove className="text-2xl" />
                      ) : (
                        <MdAdd className="text-2xl" />
                      )}
                    </div>
                  </div>
                  {activeSubMenu === "personalCare" && (
                    <div className="flex flex-col pl-5">
                      <Link
                        to="/productDet/7376135127106"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Auratint</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet/7376147021890"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Auratone</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet/7376147120194"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Aurablush 6600</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet/7376147218498"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Aurablush 6650</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet/7376147284034"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Aurablush 6670</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet/7376147382338"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Aurablush 6660</p>
                        </div>
                      </Link>
                      <Link
                        to="/productDet/7376147546178"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>Aurablush 6610</p>
                        </div>
                      </Link>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 px-5 border-b border-black cursor-pointer">
                    <Link to="/life-sciences" className="flex-grow" onClick={toggleSidebar}>
                      <p>Life Sciences</p>
                    </Link>
                    <div onClick={(e) => handleSubMenuClick("lifeSciences", e)}>
                      {activeSubMenu === "lifeSciences" ? (
                        <MdRemove className="text-2xl" />
                      ) : (
                        <MdAdd className="text-2xl" />
                      )}
                    </div>
                  </div>
                  {activeSubMenu === "lifeSciences" && (
                    <div className="flex flex-col pl-5">
                      <Link
                        to="/active-pharmaceutical-ingredients"
                        onClick={toggleSidebar}
                      >
                        <div className="py-2 px-5 border-b border-black">
                          <p>APIs</p>
                        </div>
                      </Link>
                      <Link to="/intermediate" onClick={toggleSidebar}>
                        <div className="py-2 px-5 border-b border-black">
                          <p>Intermediates</p>
                        </div>
                      </Link>
                      <Link to="/emollients" onClick={toggleSidebar}>
                        <div className="py-2 px-5 border-b border-black">
                          <p>Emollients</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Careers */}
              <Link to="/career">
                <div
                  onClick={toggleSidebar}
                  className="flex items-center justify-between py-2 px-5 border-b border-black"
                >
                  <p>Careers</p>
                </div>
              </Link>

              {/* Contact Us */}
              <Link to="/contact-us">
                <div
                  onClick={toggleSidebar}
                  className="flex items-center justify-between py-2 px-5 border-b border-black"
                >
                  <p>Contact</p>
                </div>
              </Link>
            </nav>

            <div className="mt-10">
              <div className="flex flex-col w-full gap-5 lg:gap-0">
                <h1 className="font-heading text-[32px] leading-[40px] lg:text-[33px] lg:leading-[45px]">
                  A Global Leader in Color, Care and Cure
                </h1>
              </div>
            </div>
          </div>

          {/* Second Column: Submenu for "What we offer" */}
          {activeMenu === "offer" && (
            <div className="hidden lg:flex flex-grow basis-[500px] pr-4">
              <div className="flex flex-col gap-2 font-subHeading text-[14px] lg:text-[18px] leading-[150%] text-black">
                {/* Coatings and Inks */}
                <div className="flex items-center justify-between py-2 px-5 border-b border-black cursor-pointer">
                  <Link to="/coatings-inks" className="flex-grow" onClick={toggleSidebar}>
                    <p>Coatings and Inks</p>
                  </Link>
                  <div onClick={(e) => handleSubMenuClick("coatings", e)}>
                    {activeSubMenu === "coatings" ? (
                      <MdOutlineKeyboardArrowRight className="text-2xl lg:text-2xl" />
                    ) : (
                      <MdOutlineKeyboardArrowRight className="text-2xl lg:text-2xl" />
                    )}
                  </div>
                </div>

                {/* Home, Personal Care & Cosmetics */}
                <div className="flex items-center justify-between py-2 px-5 border-b border-black cursor-pointer">
                  <Link to="/home-care-cosmetics" className="flex-grow" onClick={toggleSidebar}>
                    <p>Home, Personal Care & Cosmetics</p>
                  </Link>
                  <div onClick={(e) => handleSubMenuClick("personalCare", e)}>
                    {activeSubMenu === "personalCare" ? (
                      <MdOutlineKeyboardArrowRight className="text-2xl" />
                    ) : (
                      <MdOutlineKeyboardArrowRight className="text-2xl" />
                    )}
                  </div>
                </div>

                {/* Life Sciences */}
                <div className="flex items-center justify-between py-2 px-5 border-b border-black cursor-pointer">
                  <Link to="/life-sciences" className="flex-grow" onClick={toggleSidebar}>
                    <p>Life Sciences</p>
                  </Link>
                  <div onClick={(e) => handleSubMenuClick("lifeSciences", e)}>
                    {activeSubMenu === "lifeSciences" ? (
                      <MdOutlineKeyboardArrowRight className="text-2xl lg:text-2xl" />
                    ) : (
                      <MdOutlineKeyboardArrowRight className="text-2xl lg:text-2xl" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Third Column: Items in Submenus */}
          {activeSubMenu && (
            <div className="hidden lg:flex flex-grow basis-[450px] pr-4">
              <div className="flex flex-col gap-2 font-subHeading text-[14px] lg:text-[18px] leading-[150%] text-black">
                {activeSubMenu === "coatings" && (
                  <>
                    <Link
                      to="/productDet2/7377553227842"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>I-TINT</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet2/7377753079874"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Hydratint</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet2/7377753309250"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Smartint</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet2/7377753505858"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Tintol</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet2/7377753669698"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Blend</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet2/7377753866306"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Ultratint</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet2/7377754030146"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Walltint</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet2/7377754128450"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Aquaflexo</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet2/7377754488898"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Colorcomposit</p>
                      </div>
                    </Link>
                  </>
                )}

                {activeSubMenu === "personalCare" && (
                  <>
                    <Link
                      to="/productDet/7376135127106"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Auratint</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet/7376147021890"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Auratone</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet/7376147120194"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Aurablush 6600</p>
                      </div>
                    </Link>
                    <Link to="productDet/7376147218498" onClick={toggleSidebar}>
                      <div className="py-2 px-5 border-b border-black">
                        <p>Aurablush 6650</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet/7376147284034"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Aurablush 6670</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet/7376147382338"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Aurablush 6660</p>
                      </div>
                    </Link>
                    <Link
                      to="/productDet/7376147546178"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>Aurablush 6610</p>
                      </div>
                    </Link>
                  </>
                )}

                {activeSubMenu === "lifeSciences" && (
                  <>
                    <Link
                      to="/active-pharmaceutical-ingredients"
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>APIs</p>
                      </div>
                    </Link>
                    <Link to="/intermediate" onClick={toggleSidebar}>
                      <div className="py-2 px-5 border-b border-black">
                        <p>Intermediates</p>
                      </div>
                    </Link>
                    <Link to="/emollients" onClick={toggleSidebar}>
                      <div className="py-2 px-5 border-b border-black">
                        <p>Emollients</p>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;