import { useState, useEffect, useRef } from 'react';

const ScrollableDrivers = ({ drivers2, language }) => {
  const [metaFields, setMetaFields] = useState(null);
  const [cardWidth, setCardWidth] = useState(350); // Default card width
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  const scrollContainerRef = useRef(null);
  const cardContainerRef = useRef(null);
  const autoScrollInterval = 3000; // Decreased from 4000ms to 3000ms for faster auto-scrolling
  const scrollSpeed = 300; // Animation duration in ms (lower = faster)

  // Create a new array with duplicated items for seamless scrolling
  const extendedDrivers = [...drivers2, ...drivers2]; // Duplicate entire array

  // Calculate the card width based on screen size
  useEffect(() => {
    const updateCardWidth = () => {
      if (window.innerWidth < 640) { // sm breakpoint
        setCardWidth(window.innerWidth - 40); // Adjust for padding
      } else if (window.innerWidth < 1024) { // lg breakpoint
        setCardWidth(300);
      } else {
        setCardWidth(350);
      }
    };

    // Set initial width and update on resize
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

  // Auto-scroll functionality
  useEffect(() => {
    if (!scrollContainerRef.current || isDragging) return;

    const scrollInterval = setInterval(() => {
      scrollToCard((currentIndex + 1) % totalItems);
    }, autoScrollInterval);

    return () => clearInterval(scrollInterval);
  }, [currentIndex, totalItems, isDragging]);

  // Scroll to a specific card index with custom speed
  const scrollToCard = (index) => {
    if (!scrollContainerRef.current) return;
    
    const newScrollPosition = index * (cardWidth + 16); // 16px is the gap
    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth',
      // Setting a custom duration isn't directly possible with scrollTo,
      // but we control the overall speed by manipulating the scroll interval
    });
    
    setCurrentIndex(index);
  };

  // Scroll to the next card
  const scrollNext = () => {
    scrollToCard((currentIndex + 1) % totalItems);
  };

  // Scroll to the previous card
  const scrollPrev = () => {
    scrollToCard((currentIndex - 1 + totalItems) % totalItems);
  };

  // Handle scroll events to update the current index
  const handleScroll = () => {
    if (!scrollContainerRef.current || isDragging) return;
    
    const scrollPosition = scrollContainerRef.current.scrollLeft;
    const newIndex = Math.round(scrollPosition / (cardWidth + 16));
    
    // Check if we've reached the end of the first set
    if (newIndex >= totalItems) {
      // Reset to start of first set
      scrollContainerRef.current.scrollLeft = 0;
      setCurrentIndex(0);
    } else {
      setCurrentIndex(newIndex);
    }
  };

  // Mouse and touch event handlers with increased speed
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Snap to nearest card with faster animation
    if (scrollContainerRef.current) {
      const closestIndex = Math.round(scrollContainerRef.current.scrollLeft / (cardWidth + 16));
      scrollToCard(closestIndex % totalItems);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 3; // Increased from 2 to 3 for faster manual scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Snap to nearest card with faster animation
    if (scrollContainerRef.current) {
      const closestIndex = Math.round(scrollContainerRef.current.scrollLeft / (cardWidth + 16));
      scrollToCard(closestIndex % totalItems);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 3; // Increased from 2 to 3 for faster touch scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Apply CSS transition style for faster scrolling
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollBehavior = 'smooth';
      // This sets the CSS scroll-behavior property which we manually override for speed
      
      // Add a style tag to customize the scroll animation speed
      const styleTag = document.createElement('style');
      styleTag.innerHTML = `
        .fast-scroll {
          scroll-behavior: smooth;
          scroll-timeline: auto;
          transition: all ${scrollSpeed}ms ease-out !important;
        }
      `;
      document.head.appendChild(styleTag);
      
      scrollContainerRef.current.classList.add('fast-scroll');
      
      return () => {
        document.head.removeChild(styleTag);
      };
    }
  }, [scrollSpeed]);

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
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className='w-full flex flex-col gap-16 mb-16 px-5 lg:px-10'>
      <div className='w-full flex flex-col items-start'>
        <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>
          {metaFields.our_story_title}
        </p>
        <h1 className='font-heading text-[28px] lg:text-[54px] leading-[38px] lg:leading-[70px]'>
          {metaFields.our_story_desc}
        </h1>
      </div>

      <div className='w-full'>
        {/* Navigation buttons */}
        {/* <div className="flex justify-end mb-4 gap-2">
          <button 
            onClick={scrollPrev}
            className="bg-gray-200 rounded-full p-2 hover:bg-gray-300"
            aria-label="Previous card"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button 
            onClick={scrollNext}
            className="bg-gray-200 rounded-full p-2 hover:bg-gray-300"
            aria-label="Next card"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div> */}

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className='flex gap-4 no-scrollbar transition-all fast-scroll'
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
            WebkitOverflowScrolling: 'touch', // Enable momentum scrolling
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            transitionDuration: `${scrollSpeed}ms`,
            transitionTimingFunction: 'ease-out'
          }}
        >
          <div ref={cardContainerRef} className="flex gap-4">
            {extendedDrivers.map((driver, index) => (
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