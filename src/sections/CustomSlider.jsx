import React, { useState, useEffect } from "react";
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from "react-icons/hi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

// Custom arrow component
const CustomArrow = ({ className, style, onClick, icon }) => {
  return (
    <button
      className={`${className} bg-transparent border border-gray-400 py-2 px-3 sm:py-2 sm:px-4 rounded-sm hover:bg-black hover:text-white transition-all duration-300 ease-in-out text-sm sm:text-base`}
      style={{ ...style }}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

const CustomSlider = ({ title, subTitle, slides, language }) => {
  const [metaFields, setMetaFields] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = React.useRef(null);

  useEffect(() => {
    const fetchHomePageMeta = async () => {
      const query = `query {
        metaobjects(type: "homepage_2", first: 50) {
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
        console.log("result", result);
  
        if (result?.data?.metaobjects) {
          const fields = {};
          for (const edge of result.data.metaobjects.edges) {
            for (const field of edge.node.fields) {
              fields[field.key] = field.value;
            }
          }
  
          // Set the meta fields state with 'what_we_offer_title' and 'what_we_offer_heading'
          setMetaFields(fields);
        } else {
          console.error("Metaobjects not found in the response");
        }
      } catch (error) {
        console.error("Error fetching homepage meta fields:", error);
      }
    };
  
    fetchHomePageMeta();
  }, [language]);  

  const nextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const slideCount = slides.length;

  const settings = {
    dots: false,
    infinite: slideCount > 1,
    speed: 500,
    slidesToShow: 3, // Default for larger screens
    slidesToScroll: 1,
    arrows: false, // Disable default arrows
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    },
    responsive: [
      {
        breakpoint: 1280, // xl breakpoint
        settings: {
          slidesToShow: slideCount >= 3 ? 3 : slideCount,
          slidesToScroll: 1,
          infinite: slideCount > 3,
          swipe: true,
          touchMove: true,
        },
      },
      {
        breakpoint: 1024, // lg breakpoint
        settings: {
          slidesToShow: slideCount >= 2 ? 2 : slideCount,
          slidesToScroll: 1,
          infinite: slideCount > 2,
          swipe: true,
          touchMove: true,
        },
      },
      {
        breakpoint: 768, // md breakpoint
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: slideCount > 1,
          swipe: true,
          touchMove: true,
        },
      },
      {
        breakpoint: 640, // sm breakpoint
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: slideCount > 1,
          swipe: true,
          touchMove: true,
        },
      },
    ],
  };

  // Calculate center index based on current breakpoint
  const getCurrentSlidesToShow = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1280) return Math.min(3, slideCount);
      if (width >= 1024) return Math.min(2, slideCount);
      return 1;
    }
    return 3;
  };

  const centerIndex = Math.floor(getCurrentSlidesToShow() / 2) + currentSlide;
  
  const parseLink = (link, language) => {
    try {
      // Sanitize the string by replacing non-standard quotes with standard quotes
      let sanitizedLink = link
        .replace(/[""„»«]/g, '"')  // Replace non-standard quotes with standard double quotes
        .trim(); // Remove leading/trailing spaces
  
      // If the link looks like a JSON string, try to parse it
      if (sanitizedLink.startsWith("{") && sanitizedLink.endsWith("}")) {
        const parsedLink = JSON.parse(sanitizedLink);
        return {
          url: parsedLink.url || "#", // Safely return the URL
          isExternal: true, // Assume it's an external link
        };
      }
  
      // If the link is just a regular string, return it as-is
      return {
        url: sanitizedLink,
        isExternal: sanitizedLink.startsWith("http://") || sanitizedLink.startsWith("https://"), // Detect if it's an external link
      };
    } catch (error) {
      console.error("Error parsing link:", error, link); // Log the error and original link for debugging
      return { url: "#", isExternal: false }; // Default fallback URL if parsing fails
    }
  };   
  
  if (!metaFields) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // Determine if arrows should be shown based on screen size and slide count
  const shouldShowArrows = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1280) return slideCount > 3; // xl: show arrows if more than 3 slides
      if (width >= 1024) return slideCount > 2; // lg: show arrows if more than 2 slides
      return slideCount > 1; // md and below: show arrows if more than 1 slide
    }
    return slideCount > 3;
  };
  
  return (
    <div className="mb-5 lg:mb-10 px-2 sm:px-4 lg:px-0">
      {/* Header Section */}
      <div className="w-full flex flex-col items-start mb-5 lg:mb-10">
        <p className="py-4 sm:py-6 lg:py-10 font-subHeading font-medium text-base sm:text-lg md:text-xl lg:text-[22px]">
          {title}
        </p>
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[54px] leading-tight sm:leading-8 md:leading-10 lg:leading-[60px] xl:leading-[70px]">
          {subTitle}
        </h1>
      </div>

      {/* Slider Container */}
      <div className="relative">
        <Slider ref={sliderRef} {...settings}>
          {slides.map((slide, index) => {
            const isCenter = index === centerIndex % slides.length;

            // Parse the link using the updated parseLink function
            const { url, isExternal } = parseLink(slide.link, language);

            return (
              <div className="px-1 sm:px-2 lg:px-4 py-4 sm:py-6 lg:py-8" key={slide.id}>
                {isExternal ? (
                  // For external URLs, use <a> tag with target="_self" to open in the same tab
                  <a href={url} target="_self" rel="noopener noreferrer">
                    <div
                      className={`w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[500px] bg-center bg-cover relative rounded-lg sm:rounded-xl transition-transform duration-300 ${
                        isCenter ? "lg:scale-110" : "lg:scale-100"
                      }  shadow-md`}
                    >
                      <img
                        src={slide.image}
                        className="w-full h-full object-cover object-center rounded-lg sm:rounded-xl"
                        alt={slide.title}
                      />
                      <div className="absolute inset-0 flex items-end text-white font-medium p-3 sm:p-4 md:p-5 xl:p-7 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg sm:rounded-xl">
                        <h1 className="w-full max-w-[250px] sm:max-w-[270px] font-heading text-lg sm:text-xl md:text-2xl lg:text-[28px] xl:text-[32px] leading-6 sm:leading-7 md:leading-8 lg:leading-9 xl:leading-[40px]">
                          {slide.title}
                        </h1>
                      </div>
                    </div>
                  </a>
                ) : (
                  // For internal URLs, use <Link> component from react-router-dom
                  <Link to={url}>
                    <div
                      className={`w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[500px] bg-center bg-cover relative rounded-lg sm:rounded-xl transition-transform duration-300 ${
                        isCenter ? "lg:scale-110" : "lg:scale-100"
                      } shadow-md`}
                    >
                      <img
                        src={slide.image}
                        className="w-full h-full object-cover object-center rounded-lg sm:rounded-xl"
                        alt={slide.title}
                      />
                      <div className="absolute inset-0 flex items-end text-white font-medium p-3 sm:p-4 md:p-5 xl:p-7 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg sm:rounded-xl">
                        <h1 className="w-full max-w-[250px] sm:max-w-[270px] font-heading text-lg sm:text-xl md:text-2xl lg:text-[28px] xl:text-[32px] leading-6 sm:leading-7 md:leading-8 lg:leading-9 xl:leading-[40px]">
                          {slide.title}
                        </h1>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </Slider>

        {/* Custom Arrows - Show based on screen size and slide count */}
        {shouldShowArrows() && (
          <div className="flex justify-between items-center mt-4 sm:mt-6 px-2 sm:px-0">
            <CustomArrow 
              className="cursor-pointer flex-shrink-0" 
              icon={<HiOutlineArrowNarrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />} 
              onClick={prevSlide} 
            />
            <CustomArrow 
              className="cursor-pointer flex-shrink-0" 
              icon={<HiOutlineArrowNarrowRight className="w-4 h-4 sm:w-5 sm:h-5" />} 
              onClick={nextSlide} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSlider;