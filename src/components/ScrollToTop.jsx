import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollContainer = document.querySelector('.custom-scroll');
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0); // Scrolls the custom container to the top
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
