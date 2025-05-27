import { useState, useEffect, useRef } from 'react';

const ScrollableDrivers = ({ drivers2, language }) => {
  const [metaFields, setMetaFields] = useState(null);
  const [cardWidth, setCardWidth] = useState(350);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);
  
  const scrollContainerRef = useRef(null);
  const cardContainerRef = useRef(null);
  const autoScrollInterval = 3000;

  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Calculate the card width based on screen size
  useEffect(() => {
    const updateCardWidth = () => {
      if (window.innerWidth < 640) {
        setCardWidth(window.innerWidth - 40);
      } else if (window.innerWidth < 1024) {
        setCardWidth(300);
      } else {
        setCardWidth(350);
      }
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  // Set up the total number of items
  useEffect(() => {
    if (drivers2?.length) {
      setTotalItems(drivers2.length);
    }
  }, [drivers2]);

  // Auto-scroll functionality - scrolls through all cards once when component loads
  useEffect(() => {
    // Start auto-scroll only after component has mounted and cards are available
    if (!scrollContainerRef.current || isDragging || hasAutoScrolled || totalItems === 0 || !metaFields) return;

    // Add a small delay to ensure everything is rendered
    const startAutoScroll = setTimeout(() => {
      let scrollIndex = 0;
      
      const scrollInterval = setInterval(() => {
        scrollIndex++;
        scrollToCard(scrollIndex);
        
        // Stop auto-scrolling when we reach the last card
        if (scrollIndex >= totalItems - 1) {
          setHasAutoScrolled(true);
          clearInterval(scrollInterval);
        }
      }, autoScrollInterval);

      return () => clearInterval(scrollInterval);
    }, 500); // 500ms delay to ensure rendering is complete

    return () => clearTimeout(startAutoScroll);
  }, [totalItems, isDragging, hasAutoScrolled, cardWidth, metaFields]);

  // Scroll to a specific card index
  const scrollToCard = (index) => {
    if (!scrollContainerRef.current) return;
    
    const clampedIndex = Math.max(0, Math.min(index, totalItems - 1));
    const newScrollPosition = clampedIndex * (cardWidth + 16);
    
    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
    
    setCurrentIndex(clampedIndex);
  };

  // Scroll to the next card
  const scrollNext = () => {
    const nextIndex = Math.min(currentIndex + 1, totalItems - 1);
    scrollToCard(nextIndex);
  };

  // Scroll to the previous card
  const scrollPrev = () => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    scrollToCard(prevIndex);
  };

  // Handle scroll events to update the current index
  const handleScroll = debounce(() => {
    if (!scrollContainerRef.current || isDragging) return;
    
    const scrollPosition = scrollContainerRef.current.scrollLeft;
    const containerWidth = scrollContainerRef.current.offsetWidth;
    const totalWidth = cardWidth * totalItems + 16 * (totalItems - 1);
    
    // Check if we've reached the end
    if (scrollPosition + containerWidth >= totalWidth - 1) {
      setCurrentIndex(totalItems - 1);
      return;
    }
    
    const newIndex = Math.round(scrollPosition / (cardWidth + 16));
    const clampedIndex = Math.max(0, Math.min(newIndex, totalItems - 1));
    
    if (currentIndex !== clampedIndex) {
      setCurrentIndex(clampedIndex);
    }
  }, 100);

  // Add a scroll end listener to ensure final position is captured
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScrollEnd = () => {
      const scrollPosition = container.scrollLeft;
      const newIndex = Math.round(scrollPosition / (cardWidth + 16));
      const clampedIndex = Math.max(0, Math.min(newIndex, totalItems - 1));
      setCurrentIndex(clampedIndex);
    };

    container.addEventListener('scrollend', handleScrollEnd);
    return () => container.removeEventListener('scrollend', handleScrollEnd);
  }, [cardWidth, totalItems]);

  // Mouse and touch event handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      const closestIndex = Math.round(scrollContainerRef.current.scrollLeft / (cardWidth + 16));
      const clampedIndex = Math.max(0, Math.min(closestIndex, totalItems - 1));
      scrollToCard(clampedIndex);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      const closestIndex = Math.round(scrollContainerRef.current.scrollLeft / (cardWidth + 16));
      const clampedIndex = Math.max(0, Math.min(closestIndex, totalItems - 1));
      scrollToCard(clampedIndex);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Fetch meta fields
  useEffect(() => {
    const fetchAboutUs2 = async () => {
      const query = `query {
        metaobjects(type: "about_us_2", first: 50) {
          edges {
            node {
              id
              displayName
              fields {
                key
                value
                reference {
                  ... on MediaImage {
                    image {
                      id
                      url
                    }
                  }
                  ... on Video {
                    id
                    sources {
                      url
                      mimeType
                    }
                  }
                }
              }
            }
          }
        }
      }`;
    
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/shopify/homepage-meta`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, targetLanguage: language }),
          }
        );
    
        const result = await response.json();
    
        if (result?.data?.metaobjects) {
          const fields = {};
          for (const edge of result.data.metaobjects.edges) {
            for (const field of edge.node.fields) {
              fields[field.key] = field.value;
            }
          }
    
          setMetaFields(fields);
        } else {
          console.error("Metaobjects not found in the response");
        }
      } catch (error) {
        console.error("Error fetching homepage meta fields:", error);
      }
    };
    
    fetchAboutUs2();
  }, [language]); 
    
  if (!metaFields) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-full flex flex-col gap-16 mb-16 px-5 lg:px-10 relative'>
      <div className='w-full flex flex-col items-start'>
        <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>
          {metaFields.our_story_title}
        </p>
        <h1 className='font-heading text-[28px] lg:text-[54px] leading-[38px] lg:leading-[70px]'>
          {metaFields.our_story_desc}
        </h1>
      </div>

      <div className='w-full relative'>
        {/* Left Navigation Arrow */}
        <button 
          onClick={scrollPrev}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 transition-all duration-200 ${
            currentIndex === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' 
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl'
          }`}
          style={{ transform: 'translateY(-50%) translateX(-50%)' }}
          aria-label="Previous card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Right Navigation Arrow */}
        <button 
          onClick={scrollNext}
          disabled={currentIndex >= totalItems - 1}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 transition-all duration-200 ${
            currentIndex >= totalItems - 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70' 
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl'
          }`}
          style={{ transform: 'translateY(-50%) translateX(50%)' }}
          aria-label="Next card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className='flex gap-4 no-scrollbar'
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          style={{ 
            overflowX: 'auto', 
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div ref={cardContainerRef} className="flex gap-4">
            {drivers2.map((driver, index) => (
              <div
                key={index}
                className={`flex-shrink-0 min-h-[450px] bg-opacity-45 backdrop-blur-lg flex flex-col items-start justify-start text-black p-4 gap-4 ${driver.color} rounded-t-[42px] rounded-l-[42px]`}
                style={{ 
                  backgroundColor: 'rgba(44, 41, 130, 0.08)',
                  width: `${cardWidth}px`,
                  scrollSnapAlign: 'start'
                }}
              >
                <div className="flex flex-col justify-start h-[70px] mt-28">
                  <h1 className='text-[45px] font-heading text-left'>{driver.title}</h1>
                </div>
                <p className='text-[16px] font-subHeading leading-[24px] whitespace-normal text-left overflow-hidden'>
                  {driver.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination indicator */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalItems }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollableDrivers;