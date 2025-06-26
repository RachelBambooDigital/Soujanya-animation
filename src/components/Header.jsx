import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import Sidebar from "./Sidebar";
import Sidebar2 from "./Sidebar2";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = ({ onLanguageChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebar2Open, setIsSidebar2Open] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // New state to track scroll position
  const navigate = useNavigate();

  // Full language names and short codes
  const languages = [
    { name: "English", short: "en" },
    { name: "Polish", short: "pl" },
    { name: "German", short: "de" },
    { name: "Portuguese", short: "pt" },
    { name: "Spanish", short: "es" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebar2 = () => {
    setIsSidebar2Open(!isSidebar2Open);
  };

  // Redirect functions
  const handleContactUs = () => {
    navigate("/contact-us");
  };

  // Add scroll event listener to track scroll position
  useEffect(() => {
    const handleScroll = () => {
      // You can adjust this value to determine when the color change happens
      const firstSectionHeight = 700; // Adjust based on your first section's height
      if (window.scrollY > firstSectionHeight) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Set the initial language from localStorage if available
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
      onLanguageChange(savedLanguage); // Propagate the language change to the parent component
    }
  }, [onLanguageChange]);

  // Update the language when it's selected and save it to localStorage
  const handleLanguageChange = (langShort) => {
    setSelectedLanguage(langShort);
    onLanguageChange(langShort);
    localStorage.setItem("selectedLanguage", langShort);
    setIsDropdownOpen(false);
    console.log("Language changed to:", langShort);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Get full name of the selected language
  const getSelectedLanguageName = () => {
    const selectedLang = languages.find(
      (lang) => lang.short === selectedLanguage
    );
    return selectedLang ? selectedLang.name : "English";
  };

  // Determine colors based on scroll position
  const textColor = scrolled ? "text-black" : "text-white";
  const borderColor = scrolled ? "border-black" : "border-white";
  const iconColor = scrolled ? "text-black" : "text-white";

  return (
    <>
      <header
        className={`fixed w-full px-5 lg:px-10 h-[62px] z-40 backdrop-blur-lg transition-all duration-300`}
      >
        <div className="w-full flex items-center justify-between h-full">
          <div className={`${textColor} flex items-center gap-5`}>
            <button className="w-8" onClick={toggleSidebar}>
              <img
                src={scrolled ? "/logos/menuBlack.png" : "/logos/menu.png"}
                alt="menu"
              />
            </button>
            <Link to="/">
              <img
                src={
                  scrolled
                    ? "/logos/NavLogoBlack.svg"
                    : "/logos/NavLogoWhite.svg"
                }
                className="w-36"
                alt="logo"
              />
            </Link>
          </div>

          {/* For larger screens */}
          <div className="lg:flex gap-5 items-center hidden">
            {/* Language Dropdown */}
            <div className={`relative border ${borderColor} rounded-md`}>
              <button
                className={`text-xs font-semibold py-2 px-3 h-full ${textColor} flex items-center gap-2`}
                onClick={toggleDropdown}
              >
                {getSelectedLanguageName()}
                <span className="ml-2">
                  {isDropdownOpen ? (
                    <MdOutlineKeyboardArrowUp className={iconColor} />
                  ) : (
                    <MdOutlineKeyboardArrowDown className={iconColor} />
                  )}
                </span>
              </button>

              {/* Language dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-20 bg-white rounded-md shadow-lg">
                  {languages.map((lang) => (
                    <button
                      key={lang.short}
                      className="w-full text-left px-2 py-2 text-sm text-black hover:bg-red hover:text-white"
                      onClick={() => handleLanguageChange(lang.short)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`flex relative border ${borderColor} rounded-md`}>
              <button
                className={`text-xs font-semibold py-2 px-4 h-full ${textColor}`}
                onClick={handleContactUs}
              >
                Contact
              </button>
            </div>
            <div className={`flex relative border ${borderColor} rounded-md`}>
              <button
                className={`text-xs font-semibold py-2 px-4 h-full ${textColor}`}
                onClick={toggleSidebar2}
              >
                <CiSearch className={`${iconColor} text-lg`} />
              </button>
            </div>
          </div>

          {/* For small screens */}
          <div className="lg:hidden flex gap-3 items-center">
            <div className={`relative border ${borderColor} rounded-md`}>
              <button
                className={`text-xs font-semibold py-1 px-1 h-full ${textColor} flex items-center`}
                onClick={toggleDropdown}
              >
                {getSelectedLanguageName()}
                <span className="ml-2">
                  {isDropdownOpen ? (
                    <MdOutlineKeyboardArrowUp className={iconColor} />
                  ) : (
                    <MdOutlineKeyboardArrowDown className={iconColor} />
                  )}
                </span>
              </button>

              {/* Mobile dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-20 bg-white rounded-md shadow-lg">
                  {languages.map((lang) => (
                    <button
                      key={lang.short}
                      className="w-full text-left px-2 py-2 text-sm text-black hover:bg-red hover:text-white"
                      onClick={() => handleLanguageChange(lang.short)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`flex relative border ${borderColor} rounded-md`}>
              <button
                className={`text-xs font-semibold py-1 px-2 h-full ${textColor}`}
                onClick={toggleSidebar2}
              >
                <CiSearch className={`${iconColor} text-sm`} />
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
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            language={selectedLanguage}
          />
        </div>
      )}
    </>
  );
};

export default Header;
