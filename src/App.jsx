import { useRef, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Header1 from "./components/Header1";
import Header2 from "./components/Header2";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import LocomotiveScroll from "locomotive-scroll";
import LifeSciencesAPI from "./pages/LifeSciencesAPI";
import Emollients from "./pages/Emollients";
import Intermediate from "./pages/Intermediate";
import LifeSciences from "./pages/LifeSciences";
import ContactUs from "./pages/ContactUs";
import HomeCareCosmetics from "./pages/HomeCareCosmetics";
import CoatingsInks from "./pages/CoatingsInks";
import ProductListing from "./pages/ProductListing";
import ProductListing2 from "./pages/ProductListing2";
import ProductListing3 from "./pages/ProductListing3";
import ProductDetail from "./pages/ProductDetail";
import ProductDetail2 from "./pages/ProductDetail2";
import Career from "./pages/Career";
import BlogDetail from "./pages/BlogDetail";
import Footer from "./components/Footer";

function App() {
  const scrollRef = useRef(null); // Initialize scrollRef

  useEffect(() => {
    if (scrollRef.current) {
      const locomotiveScroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
      });

      return () => {
        locomotiveScroll.destroy(); // Clean up on component unmount
      };
    }
  }, []);

  const location = useLocation();

  const getHeaderComponent = () => {
    const headerRoutes = ['/', '/active-pharmaceutical-ingredients', '/emollients', '/intermediate',];
    const header1Routes = ['/life-sciences', '/contact-us', '/home-care-cosmetics', '/about-us', '/coatings-inks', '/career', '/blogDetail'];
    const header2Routes = ['/product-listing', '/product-listing2', '/product-listing3',];

    if (headerRoutes.includes(location.pathname)) {
      return <Header />;
    } else if (header1Routes.includes(location.pathname)) {
      return <Header1 />;
    } else if (header2Routes.includes(location.pathname)) {
      return <Header2 />;
    }
    else if (location.pathname.startsWith('/productDet/')) {
      return <Header />; 
    }
    else if (location.pathname.startsWith('/productDet2/')) {
      return <Header />; 
    }
    return null; // In case there's no matching route, return null or a default header
  };

  return (
    <div ref={scrollRef} className="scroll-container"> {/* Add ref to the container */}
      {getHeaderComponent()}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/life-sciences" element={<LifeSciences />} />
        <Route path="/active-pharmaceutical-ingredients" element={<LifeSciencesAPI />} />
        <Route path="/emollients" element={<Emollients />} />
        <Route path="/intermediate" element={<Intermediate />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/career" element={<Career />} />
        <Route path="/home-care-cosmetics" element={<HomeCareCosmetics />} />
        <Route path="/coatings-inks" element={<CoatingsInks />} />
        <Route path="/product-listing" element={<ProductListing />} />
        <Route path="/product-listing2" element={<ProductListing2 />} />
        <Route path="/product-listing3" element={<ProductListing3 />} />
        <Route path="/productDet/:productId" element={<ProductDetail />} />
        <Route path="/productDet2/:productId" element={<ProductDetail2 />} />
        <Route path="/blogDetail" element={<BlogDetail />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
