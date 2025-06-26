import { useState, useEffect, useRef } from "react";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
  MdAdd,
  MdRemove,
} from "react-icons/md";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar, language = "en" }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [products, setProducts] = useState({
    coatings: [],
    personalCare: [],
    lifeSciences: [],
  });

  const sidebarRef = useRef(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/shopify/fetchProductCategories`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetLanguage: language }),
          }
        );
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid data");

        const categoryProducts = {
          coatings: [],
          personalCare: [],
          lifeSciences: [],
        };

        data.forEach((edge) => {
          const fields = edge.node.fields;

          // Get products for coatings (products_3)
          const coatingsProducts =
            fields
              .find((f) => f.key === "products_3")
              ?.references?.edges.map((e) => e.node) || [];
          categoryProducts.coatings = coatingsProducts;

          // Get products for personal care (products)
          const personalCareProducts =
            fields
              .find((f) => f.key === "products")
              ?.references?.edges.map((e) => e.node) || [];
          categoryProducts.personalCare = personalCareProducts;

          // Get products for life sciences (products_2)
          const lifeSciencesProducts =
            fields
              .find((f) => f.key === "products_2")
              ?.references?.edges.map((e) => e.node) || [];
          categoryProducts.lifeSciences = lifeSciencesProducts;
        });

        setProducts(categoryProducts);
      } catch (err) {
        console.error("Products fetch error:", err);
      }
    };

    if (isOpen) {
      fetchProducts();
    }
  }, [language, isOpen]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu === activeMenu ? null : menu);
    setActiveSubMenu(null);
  };

  const handleSubMenuClick = (submenu, event) => {
    event.stopPropagation();
    setActiveSubMenu(submenu === activeSubMenu ? null : submenu);
  };

  // Generate product link based on category
  const getProductLink = (product, category) => {
    const productId = product.id.replace("gid://shopify/Product/", "");

    switch (category) {
      case "coatings":
        return `/productDet2/${productId}`;
      case "personalCare":
        return `/productDet/${productId}`;
      case "lifeSciences":
        // Special handling for life sciences products
        const urlMap = {
          7376925884482: "/active-pharmaceutical-ingredients",
          7377107648578: "/emollients",
          7377107451970: "/intermediate",
        };
        return urlMap[productId] || `/productDet/${productId}`;
      default:
        return `/productDet/${productId}`;
    }
  };

  // Calculate sidebar width based on active sections
  const sidebarWidth =
    520 * (1 + (activeMenu ? 1 : 0) + (activeSubMenu ? 1 : 0));

  // Effect to handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

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
      style={{ width: `${sidebarWidth}px`, maxWidth: "90vw" }}
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
                <MdOutlineKeyboardArrowRight className="text-2xl" />
              </div>

              {/* Mobile Submenu for "What we offer" */}
              {activeMenu === "offer" && (
                <div className="lg:hidden flex flex-col gap-2 font-subHeading text-[14px] lg:text-[18px] leading-[150%] text-black pl-2">
                  <div className="flex items-center justify-between py-2 px-5 border-b border-black cursor-pointer">
                    <Link
                      to="/coatings-inks"
                      className="flex-grow"
                      onClick={toggleSidebar}
                    >
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
                      {products.coatings.map((product, index) => (
                        <Link
                          key={product.id || index}
                          to={getProductLink(product, "coatings")}
                          onClick={toggleSidebar}
                        >
                          <div className="py-2 px-5 border-b border-black">
                            <p>{product.title}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 px-5 border-b border-black cursor-pointer">
                    <Link
                      to="/home-care-cosmetics"
                      className="flex-grow"
                      onClick={toggleSidebar}
                    >
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
                      {products.personalCare.map((product, index) => (
                        <Link
                          key={product.id || index}
                          to={getProductLink(product, "personalCare")}
                          onClick={toggleSidebar}
                        >
                          <div className="py-2 px-5 border-b border-black">
                            <p>{product.title}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 px-5 border-b border-black cursor-pointer">
                    <Link
                      to="/life-sciences"
                      className="flex-grow"
                      onClick={toggleSidebar}
                    >
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
                      {products.lifeSciences.map((product, index) => (
                        <Link
                          key={product.id || index}
                          to={getProductLink(product, "lifeSciences")}
                          onClick={toggleSidebar}
                        >
                          <div className="py-2 px-5 border-b border-black">
                            <p>{product.title}</p>
                          </div>
                        </Link>
                      ))}
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
                  <Link
                    to="/coatings-inks"
                    className="flex-grow"
                    onClick={toggleSidebar}
                  >
                    <p>Coatings and Inks</p>
                  </Link>
                  <div onClick={(e) => handleSubMenuClick("coatings", e)}>
                    <MdOutlineKeyboardArrowRight className="text-2xl lg:text-2xl" />
                  </div>
                </div>

                {/* Home, Personal Care & Cosmetics */}
                <div className="flex items-center justify-between py-2 px-5 border-b border-black cursor-pointer">
                  <Link
                    to="/home-care-cosmetics"
                    className="flex-grow"
                    onClick={toggleSidebar}
                  >
                    <p>Home, Personal Care & Cosmetics</p>
                  </Link>
                  <div onClick={(e) => handleSubMenuClick("personalCare", e)}>
                    <MdOutlineKeyboardArrowRight className="text-2xl" />
                  </div>
                </div>

                {/* Life Sciences */}
                <div className="flex items-center justify-between py-2 px-5 border-b border-black cursor-pointer">
                  <Link
                    to="/life-sciences"
                    className="flex-grow"
                    onClick={toggleSidebar}
                  >
                    <p>Life Sciences</p>
                  </Link>
                  <div onClick={(e) => handleSubMenuClick("lifeSciences", e)}>
                    <MdOutlineKeyboardArrowRight className="text-2xl lg:text-2xl" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Third Column: Dynamic Products in Submenus */}
          {activeSubMenu && (
            <div className="hidden lg:flex flex-grow basis-[450px] pr-4">
              <div className="flex flex-col gap-2 font-subHeading text-[14px] lg:text-[18px] leading-[150%] text-black">
                {activeSubMenu === "coatings" &&
                  products.coatings.map((product, index) => (
                    <Link
                      key={product.id || index}
                      to={getProductLink(product, "coatings")}
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>{product.title}</p>
                      </div>
                    </Link>
                  ))}

                {activeSubMenu === "personalCare" &&
                  products.personalCare.map((product, index) => (
                    <Link
                      key={product.id || index}
                      to={getProductLink(product, "personalCare")}
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>{product.title}</p>
                      </div>
                    </Link>
                  ))}

                {activeSubMenu === "lifeSciences" &&
                  products.lifeSciences.map((product, index) => (
                    <Link
                      key={product.id || index}
                      to={getProductLink(product, "lifeSciences")}
                      onClick={toggleSidebar}
                    >
                      <div className="py-2 px-5 border-b border-black">
                        <p>{product.title}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
