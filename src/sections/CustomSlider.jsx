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
      className={`${className} bg-transparent border border-gray-400 py-1 px-3 rounded-sm hover:bg-black hover:text-white transition-all duration-300 ease-in-out`}
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
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const slideCount = slides.length;
  const slidesToShowCount = slideCount < 3 ? slideCount : 3; // Show only the available number of slides

  const settings = {
    dots: false,
    infinite: slideCount > slidesToShowCount,
    speed: 500,
    slidesToShow: 3, // Default for larger screens
    slidesToScroll: 1,
    arrows: false, // Disable default arrows
    swipe: false, // Disable swipe for desktop
    touchMove: false, // Disable touch gestures for desktop
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    },
    responsive: [
      {
        breakpoint: 1024, // For tablets and smaller screens
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          swipe: true, // Enable swipe for tablet
          touchMove: true,
          arrows: false,
        },
      },
      {
        breakpoint: 769, // For mobile screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          swipe: true, // Enable swipe for mobile
          touchMove: true,
          arrows: false,
        },
      },
    ],
  };

  const centerIndex = Math.floor(settings.slidesToShow / 2) + currentSlide;
  
  const parseLink = (link, language) => {
    try {
      // Sanitize the string by replacing non-standard quotes with standard quotes
      let sanitizedLink = link
        .replace(/[“”„»«]/g, '"')  // Replace non-standard quotes with standard double quotes
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
    return <div>Loading...</div>; // Loading state
  }
  
  return (
    <div className="mb-5 lg:mb-10">
      <div className="w-full flex flex-col items-start mb-5 lg:mb-10">
        <p className="py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
          {title}
        </p>
        <h1 className="font-heading text-[28px] lg:text-[54px] leading-10 lg:leading-[70px]">
          {subTitle}
        </h1>
      </div>

      <Slider ref={sliderRef} {...settings}>
      {slides.map((slide, index) => {
        const isCenter = index === centerIndex % slides.length;

        // Parse the link using the updated parseLink function
        const { url, isExternal } = parseLink(slide.link, language);

        return (
          <div className="w-full px-2 lg:px-4 py-8" key={slide.id}>
            {isExternal ? (
              // For external URLs, use <a> tag with target="_self" to open in the same tab
              <a href={url} target="_self" rel="noopener noreferrer">
                <div
                  className={`w-full h-[300px] md:h-[400px] xl:h-[500px] bg-center bg-cover relative rounded-xl transition-transform duration-300 ${
                    isCenter ? "lg:scale-110" : "lg:scale-100"
                  }`}
                >
                  <img
                    src={slide.image}
                    className="w-full h-full object-cover object-center rounded-xl"
                    alt={slide.title}
                  />
                  <div className="absolute inset-0 flex items-end text-white font-medium p-5 xl:p-7">
                    <h1 className="w-[270px] font-heading text-[24px] md:text-[32px] leading-[40px]">
                      {slide.title}
                    </h1>
                  </div>
                </div>
              </a>
            ) : (
              // For internal URLs, use <Link> component from react-router-dom
              <Link to={url}>
                <div
                  className={`w-full h-[300px] md:h-[400px] xl:h-[500px] bg-center bg-cover relative rounded-xl transition-transform duration-300 ${
                    isCenter ? "lg:scale-110" : "lg:scale-100"
                  }`}
                >
                  <img
                    src={slide.image}
                    className="w-full h-full object-cover object-center rounded-xl"
                    alt={slide.title}
                  />
                  <div className="absolute inset-0 flex items-end text-white font-medium p-5 xl:p-7">
                    <h1 className="w-[270px] font-heading text-[24px] md:text-[32px] leading-[40px]">
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

      {/* Custom Arrows for desktop */}
      <div className="flex justify-between px-4">
        <CustomArrow icon={<HiOutlineArrowNarrowLeft />} onClick={prevSlide} />
        <CustomArrow icon={<HiOutlineArrowNarrowRight />} onClick={nextSlide} />
      </div>
    </div>
  );
};

export default CustomSlider;
