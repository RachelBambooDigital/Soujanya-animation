import { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";

const Sidebar2 = ({ isOpen, toggleSidebar2 }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    products: [],
    metaobjects: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sidebarRef = useRef(null); // Reference for the sidebar

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      setError(null);

      fetch(`${import.meta.env.VITE_BASE_URL}/shopify/search-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          return response.json();
        })
        .then((data) => {
          setSearchResults(data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
        });
    } else {
      setSearchResults({ products: [], metaobjects: [] });
    }
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle product redirection
  const handleProductClick = (redirectUrl) => {
    const validUrl = redirectUrl.startsWith("http")
      ? redirectUrl
      : `https://${redirectUrl}`;
    if (validUrl) {
      window.location.href = validUrl;
    } else {
      console.log("No redirect URL found for this product.");
    }
  };

  // Handle metaobject redirection
  const handleMetaobjectClick = (redirecturlmeta) => {
    if (redirecturlmeta) {
      const validUrl = redirecturlmeta.startsWith("http")
        ? redirecturlmeta
        : `https://${redirecturlmeta}`;
      window.location.href = validUrl;
    } else {
      console.log("No redirect URL found for this metaobject.");
    }
  };

  // Effect to handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar2(); // Close the sidebar if the click is outside
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
  }, [isOpen, toggleSidebar2]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 w-full md:w-[70%] lg:w-[30%] h-full bg-white z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out overflow-y-scroll custom-scroll`}
    >
      <div className="w-full h-full flex flex-col gap-16">
        <div className="w-full px-5 lg:px-10 h-[62px] z-40 bg-opacity-90 transition-all duration-300">
          <div className="w-full flex items-center justify-between h-full py-10">
            <div className="text-black flex items-center gap-5">
              <button className="w-5" onClick={toggleSidebar2}>
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

        <div className="relative flex flex-col px-5 lg:px-10 gap-4">
          <div className="relative border-b w-[100%]">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-3 py-2 bg-transparent text-[gray] focus:outline-none text-sm sm:text-base"
            />
            <CiSearch className="absolute left-3 top-2 text-lg sm:text-xl" />
          </div>

          {searchQuery && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-md overflow-y-auto z-50 w-full">
              {isLoading ? (
                <p className="p-4 text-gray-500">Loading...</p>
              ) : error ? (
                <p className="p-4 text-red-500">{error}</p>
              ) : (
                <>
                  <div className="p-4 ml-10">
                    <h4 className="font-bold">Products</h4>
                    {searchResults?.products?.length ? (
                      searchResults.products.map((product) => (
                        <div
                          key={product.id}
                          className="py-1 cursor-pointer"
                          onClick={() => handleProductClick(product.redirectUrl)}
                        >
                          <p>{product.title}</p>
                        </div>
                      ))
                    ) : (
                      <p>No matching products found.</p>
                    )}
                  </div>
                  <div className="p-4 ml-10">
                    <h5 className="font-semibold">Pages</h5>
                    {searchResults?.metaobjects?.length ? (
                      searchResults.metaobjects.map((metaobject) => (
                        <div
                          key={metaobject.id}
                          className="py-1 cursor-pointer"
                          onClick={() => handleMetaobjectClick(metaobject.redirecturlmeta)}
                        >
                          <p>{metaobject.pageTitle}</p>
                        </div>
                      ))
                    ) : (
                      <p>No matching fields found.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar2;
