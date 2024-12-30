import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md"; // Import the arrow icons
import Sidebar from "./Sidebar";
import Sidebar2 from "./Sidebar2";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = ({ onLanguageChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebar2Open, setIsSidebar2Open] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // State for short language code
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle dropdown
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
    navigate('/contact-us');
  };

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
    setSelectedLanguage(langShort); // Update selected language short code
    onLanguageChange(langShort); // Pass selected short language code to parent
    localStorage.setItem("selectedLanguage", langShort); // Store selected language in localStorage
    setIsDropdownOpen(false); // Close dropdown
    console.log('Language changed to:', langShort);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  // Get full name of the selected language
  const getSelectedLanguageName = () => {
    const selectedLang = languages.find(lang => lang.short === selectedLanguage);
    return selectedLang ? selectedLang.name : "English"; // Default to English if not found
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
              <img src="/logos/NavLogoWhite.svg" className="w-36" alt="logo" />
            </Link>
          </div>

          {/* For larger screens */}
          <div className="lg:flex gap-5 items-center hidden">
            {/* Language Dropdown */}
            <div className="relative border border-white rounded-md">
              <button
                className="text-xs font-semibold py-2 px-3 h-full text-white flex items-center gap-2"
                onClick={toggleDropdown}>
                {getSelectedLanguageName()} {/* Display full language name */}
                <span className="ml-2">
                  {isDropdownOpen ? (
                    <MdOutlineKeyboardArrowUp className="text-white" /> // Up arrow when dropdown is open
                  ) : (
                    <MdOutlineKeyboardArrowDown className="text-white" /> // Down arrow when dropdown is closed
                  )}
                </span>
              </button>

              {/* Language dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-20 bg-white rounded-md shadow-lg">
                  {languages.map((lang) => (
                    <button
                      key={lang.short}
                      className="w-full text-left px-2 py-2 text-sm text-black hover:bg-red hover:text-white" // Red background on hover
                      onClick={() => handleLanguageChange(lang.short)}>
                      {lang.name} {/* Display the full name of the language */}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex relative border border-white rounded-md">
              <button className={`text-xs font-semibold py-2 px-4 h-full text-white`} onClick={handleContactUs}>
                Contact
              </button>
            </div>
            <div className="flex relative border border-white rounded-md">
              <button
                className={`text-xs font-semibold py-2 px-4 h-full text-white`}  
                onClick={toggleSidebar2}>
                <CiSearch className="text-white text-lg" />
              </button>
            </div>
          </div>

          {/* For small screens */}
          <div className="lg:hidden flex gap-3 items-center">
            <div className="relative border border-white rounded-md">
              <button 
                className="text-xs font-semibold py-1 px-1 h-full text-white flex items-center" // Added flex and gap
                onClick={toggleDropdown}> {/* Open dropdown when clicked */}
                {getSelectedLanguageName()} {/* Display full language name */}
                <span className="ml-2">
                  {isDropdownOpen ? (
                    <MdOutlineKeyboardArrowUp className="text-white" />
                  ) : (
                    <MdOutlineKeyboardArrowDown className="text-white" />
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
                      onClick={() => handleLanguageChange(lang.short)}>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex relative border border-white rounded-md">
              <button
                className={`text-xs font-semibold py-1 px-2 h-full text-white`}  
                onClick={toggleSidebar2}>
                <CiSearch className="text-white text-sm" />
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
    </>
  );
};

export default Header;
