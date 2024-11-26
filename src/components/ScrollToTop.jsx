import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Extract the current route path

  useEffect(() => {
    // Scroll to the top of the page on every route change
    window.scrollTo(0, 0); // Scrolls the whole page to the top
  }, [pathname]); // Run effect on every route change

  return null; // This component doesn't render anything
};

export default ScrollToTop;
