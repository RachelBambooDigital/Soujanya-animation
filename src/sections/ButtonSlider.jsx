import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from 'react-icons/hi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Custom arrow component
const CustomArrow = ({ className, style, onClick, icon }) => {
  return (
    <button
      className={`${className} bg-transparent border border-gray-400 py-1 px-3 rounded-sm hover:bg-black hover:text-white transition-all duration-300 ease-in-out`}
      style={{ ...style }}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

const ButtonSlider = ({ categories, onCategorySelect, activeCategory, showAlternateContent, setShowAlternateContent }) => {
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);

  // Check screen size to set isMobile state for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this threshold as needed
    };

    handleResize(); // Initialize the state
    window.addEventListener('resize', handleResize); // Update on window resize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  // Slider settings for mobile
  const sliderSettings = {
    infinite: false, // Disable infinite scroll to prevent looping
    speed: 300,
    slidesToShow: 1, // Show only 1 button at a time
    slidesToScroll: 1, // Scroll one slide at a time
    arrows: true, // Enable arrows (we will use custom arrows)
    swipe: true, // Enable swipe for mobile
    touchMove: true,
    nextArrow: (
      <CustomArrow
        icon={<HiOutlineArrowNarrowRight />}
        className="slick-next" // Class name for slick
      />
    ),
    prevArrow: (
      <CustomArrow
        icon={<HiOutlineArrowNarrowLeft />}
        className="slick-prev" // Class name for slick
      />
    ),
    responsive: [
      {
        breakpoint: 1024, // On tablet and above
        settings: {
          slidesToShow: 1, // Show only 1 button per slide
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For mobile screens
        settings: {
          slidesToShow: 1, // Show only 1 button per slide
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="mb-5 lg:mb-10">
      {/* Display carousel for mobile screens */}
      <Slider ref={sliderRef} {...sliderSettings}>
        {Object.keys(categories).map((category) => (
          <div key={category} className="w-full px-2 lg:px-4 py-8 flex justify-center">
            <div className="flex flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  onCategorySelect(category);
                  setShowAlternateContent(false); // Default content
                }}
                className={`px-6 py-2 border rounded-md transition-all duration-300 ease-in-out w-[15rem] sm:w-[20rem] md:w-[20rem] lg:w-[20rem] ${
                  activeCategory === category && !showAlternateContent
                    ? 'bg-red text-white shadow-lg'
                    : 'bg-white text-black border border-gray-300 hover:bg-[#d2d3d3]'
                }`}
              >
                {categories[category].title}
              </button>

              {/* Alternate Content Button */}
              {categories[category].title1 && (
                <button
                  onClick={() => {
                    onCategorySelect(category);
                    setShowAlternateContent(true); // Alternate content
                  }}
                  className={`px-6 py-2 border rounded-md transition-all duration-300 ease-in-out w-[15rem] sm:w-[20rem] md:w-[20rem] lg:w-[20rem] ${
                    activeCategory === category && showAlternateContent
                      ? 'bg-red text-white shadow-lg'
                      : 'bg-white text-black border border-gray-300 hover:bg-[#d2d3d3]'
                  }`}
                >
                  {categories[category].title1}
                </button>
              )}
            </div>
          </div>
        ))}
      </Slider>

      {/* Custom Arrows */}
      {isMobile && (
        <div className="flex justify-between px-4 mt-4">
          <CustomArrow icon={<HiOutlineArrowNarrowLeft />} onClick={prevSlide} />
          <CustomArrow icon={<HiOutlineArrowNarrowRight />} onClick={nextSlide} />
        </div>
      )}
    </div>
  );
};

export default ButtonSlider;
