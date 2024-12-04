import Cards from "@/components/Cards";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { businessCards, slides } from "../lib/contants";
import CustomSlider from "../sections/CustomSlider";
import OurProducts from "../sections/OurProducts";
import OurGlobalPresence from "@/sections/OurGlobalPresence";
import Loader from "../pages/Loader";
import Footer from "../components/Footer";

const Home = () => {
  const [metaFields, setMetaFields] = useState(null);
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();

  const [svgContent, setSvgContent] = useState(""); // State to hold SVG content
  const svgContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const pathRef = useRef(null);

  const [viewBox, setViewBox] = useState("250 0 2436 5350");
  const [width, setWidth] = useState("2100");
  const [height, setHeight] = useState("5800");

  // width="2100" height="5800" viewBox="250 0 2436 5350"

 useEffect(() => {
  const path = pathRef.current;
  if (!path) return;

  const pathLength = path.getTotalLength(); // Get the total length of the path

  const handleOffset = (mPercent) => {
    const distance = window.scrollY;
    const totalDistance = document.body.scrollHeight - window.innerHeight;
    const percentage = typeof mPercent === "number" ? mPercent : distance / totalDistance;

    // Clamp percentage value to ensure it doesn't exceed [0, 1] range
    const clampedPercentage = Math.min(Math.max(percentage, 0), 1);

    // Update the strokeDasharray and strokeDashoffset values
    const offset = pathLength - (pathLength * clampedPercentage * 1.3); // Adjust for desired speed

    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = offset;
  };

  window.addEventListener("scroll", () => handleOffset());
  
  // Trigger initially
  handleOffset(0);

  

  return () => {
    window.removeEventListener("scroll", () => handleOffset());
  };
}, []);
// Run this effect only when `metaFields` is set

  useEffect(() => {
    const fetchHomePageMeta = async () => {
      const query = `query {
            metaobjects(type: "homepage", first: 50) {
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
            body: JSON.stringify({ query }),
          }
        );

        const result = await response.json();

        if (result && result.data && result.data.metaobjects) {
          const fields = {};
          const slidesArray = [];

          for (const edge of result.data.metaobjects.edges) {
            for (const field of edge.node.fields) {
              if (field.key.startsWith("what_we_offer_card")) {
                const cardIndex = parseInt(field.key.split("_").pop(), 10) - 1;

                if (!slidesArray[cardIndex]) {
                  slidesArray[cardIndex] = { id: cardIndex + 1 };
                }

                if (field.key.includes("title")) {
                  slidesArray[cardIndex].title = field.value;
                } else if (
                  field.key.includes("image") &&
                  field.reference?.image?.url
                ) {
                  slidesArray[cardIndex].image = field.reference.image.url;
                } else if (field.key.includes("link")) {
                  slidesArray[cardIndex].link = field.value;
                }
              } else {
                fields[field.key] = field.value;
              }
            }
          }

          const imageFetchPromises = result.data.metaobjects.edges.map(
            async (edge) => {
              for (const field of edge.node.fields) {
                if (field.reference?.image?.url) {
                  fields[field.key] = field.reference.image.url;
                } else if (field.reference?.sources) {
                  fields[field.key] = field.reference.sources[0].url;
                } else {
                  fields[field.key] = field.value;
                }

                // Check for GIDs and handle parsing
                if (field.key === "who_we_are_image") {
                  // console.log("GIDs for who_we_are_image:", fields[field.key]);
                  // Parse if it is a string
                  const gids =
                    typeof fields[field.key] === "string"
                      ? JSON.parse(fields[field.key])
                      : fields[field.key];
                  if (Array.isArray(gids)) {
                    const imageUrls = await Promise.all(
                      gids.map((gid) => fetchImage(gid))
                    );
                    fields[field.key] = imageUrls; // Set the image URLs
                  } else {
                    console.error("who_we_are_image is not an array");
                  }
                }
              }
            }
          );

          await Promise.all(imageFetchPromises);
          // console.log("Fetched metaFields:", fields); // Log to check the structure
          setMetaFields(fields);
          setSlides(slidesArray.filter((slide) => slide.image && slide.title)); // Set slides state

          // console.log("Slides Array:", slidesArray);
        } else {
          console.error("Metaobjects not found in the response");
        }

        // console.log('Metaobjects response:', result);
        // console.log('Fetched slides:', slides);
      } catch (error) {
        console.error("Error fetching homepage meta fields:", error);
      }
    };

    fetchHomePageMeta();
  }, []);

  useEffect(() => {
    const updateSVGSize = () => {
      if (window.innerWidth <= 768) {
        setViewBox("450 0 990 5000");
        setWidth("900");
        setHeight("5050");
      } else {
        setViewBox("250 0 2436 5350");
        setWidth("2100");
        setHeight("5800");
      }
    };

    updateSVGSize(); // Initial check
    window.addEventListener("resize", updateSVGSize);

    return () => window.removeEventListener("resize", updateSVGSize);
  }, []);

  // Function to fetch image URL
  const fetchImage = async (gid) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/shopify/media/${encodeURIComponent(
          gid
        )}`
      );
      if (!response.ok) {
        console.error(`Failed to fetch media. Status: ${response.status}`);
        return null;
      }

      const data = await response.json();
      if (data.url) {
        // console.log("Fetched Image URL:", data.url);
        return data.url;
      }
      throw new Error("Image URL not found in response");
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return null;
    }
  };

  if (!metaFields) {
    return <Loader />;
  }

  // Redirect functions
  const handleContactUs = () => {
    navigate("/contact-us");
  };

  const handleAboutUs = () => {
    navigate("/about-us");
  };

  return (
    <div
      className="scrollContainer w-full lg:h-[4850px] overflow-hidden bg-no-repeat"
      ref={svgContainerRef}
    >
      <svg
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1920 5721"
        >
          <defs>
            <linearGradient
              id="linear-gradient"
              x1="40.54"
              y1="2845.27"
              x2="1882.55"
              y2="2845.27"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color="#43ac50" />
              <stop offset=".06" stop-color="#afcc36" />
              <stop offset=".12" stop-color="#019acc" />
              <stop offset=".2" stop-color="#2f2f82" />
              <stop offset=".28" stop-color="#b61e7a" />
              <stop offset=".36" stop-color="#9d2b24" />
              <stop offset=".42" stop-color="#ea5e50" />
              <stop offset=".48" stop-color="#e5a26a" />
              <stop offset=".55" stop-color="#81b3be" />
              <stop offset=".63" stop-color="#cd8cbd" />
              <stop offset=".7" stop-color="#5b5fab" />
              <stop offset=".77" stop-color="#c0278d" />
              <stop offset=".84" stop-color="#75bcd3" />
              <stop offset=".92" stop-color="#5f75b8" />
              <stop offset=".97" stop-color="#948dc4" />
            </linearGradient>
          </defs>
          <path
            strokeOpacity="0.8"
            strokeWidth="21"
            speed="2"
            stay=".7"
            className="scrollPath cls-1"
            style={{ strokeDasharray: "80000", zIndex: 5 }}
            ref={pathRef}
            stroke-width="80"
            d="M370.47,154.96c9.44,16.5,23.64,38.96,43.68,63.34,70.3,85.51,153.52,122.92,192.2,139.78,96.45,42.06,178.16,46.39,266.46,50.23,51.34,2.24,132.49-5.03,292.67-19.66,215.56-19.68,248.09-22.68,310.15-19.66,50.4,2.46,154,10.54,264.28,63.34,60.37,28.91,89.52,55.31,107.02,89.55,5.74,11.23,31.6,59.67,15.29,113.57-17.94,59.26-74.9,86.2-110.84,103.2-58.76,27.79-111.87,30.29-134.32,31.12-205.88,7.66-411.61-1.48-516-4.91-77.65-2.55-57.23-.57-142.51-3.28-209.26-6.65-255.84-16.19-394.78-14.74-67.48.7-147.97,3.91-244.08,26.21-45.47,10.55-84.62,23.1-126.13,47.5-40.19,23.62-86.16,50.64-109.75,104.84-28.91,66.4-6.04,131.79,0,149.07,35.38,101.18,131.79,147.28,183.47,172,103.57,49.53,200.75,50.15,301.41,50.78,58.29.37,99.48-4.05,168.72-11.47,33.41-3.58,94.71-10.85,301.41-49.14,158.55-29.37,170.7-34.03,222.78-37.68,46.64-3.27,124.87-8.27,221.14,8.19,104.71,17.91,182.12,31.15,250.63,90.1,91.68,78.89,155.69,229.58,106.48,358.74-36.32,95.33-121.51,145.32-147.43,160.53-59.42,34.87-114.03,44.24-145.79,49.14-283.83,43.79-569.99,36.47-583.16,36.04-82.66-2.68-155.33-6.71-303.05-9.83-37.57-.79-140.61-2.5-268.65,18.02-44.9,7.2-111.74,20.15-175.28,67.16-41.57,30.76-55.59,56.77-60.61,67.16-30.21,62.52-7.52,124.28-4.91,131.05,20.63,53.53,64.69,79.33,109.75,104.84,91.73,51.93,178.08,61.79,198.21,63.89,170.61,17.78,314.04,9.96,479.96,3.28,330.86-13.32,150.07,2.09,396.42-6.55,36.78-1.29,108.6-4.01,201.49,11.47,91.64,15.27,167.61,29.03,221.14,91.73,9.94,11.64,57.5,67.35,49.14,139.24-2.82,24.25-12.95,58.51-55.7,104.84-89.12,96.58-209.65,125.98-247.35,134.32-89.9,19.9-191.69,26.98-540.57-26.21-225.67-34.4-256.78-48.6-365.29-45.87-195.29,4.92-297.41,56.02-355.47,95.01-70.25,47.18-106.29,96.99-116.3,111.39-22.33,32.11-76.15,109.53-70.44,216.23,5.26,98.19,57.93,165,83.54,196.57,55.55,68.48,122.58,105.13,199.85,137.6,84.87,35.67,218.27,81.51,576.61,126.13,140.41,17.49,206.06,21.17,322.7,50.78,145.79,37.01,214.36,74.68,252.27,98.29,52.21,32.52,124.96,77.82,181.83,167.09,25.83,40.55,91.05,141.64,73.71,262.09-28.94,201.08-258.71,285.02-278.45,291.94-54.37,19.07-104.14,24.22-196.94,22.59-237.55-4.18-326.37-45.23-520.94-67.76-211.63-24.51-405.13-46.93-550.59,67.76-27.84,21.95-106.56,85.92-127.06,194.82-20.88,110.92,31.56,199.84,46.59,224.47,91.04,149.24,272.81,182.12,343.06,194.82,304.95,55.15,618.16-101.22,643.76-114.35,40.73-20.9,103.98-57.03,199.06-72,57.34-9.03,154.47-25.43,249.88,16.94,146.44,65.03,200.6,228.45,237.18,338.82,31.44,94.86,40.08,177.7,42.35,232.94"
          />
        </svg>

      {/* Main content */}
      <div className="absolute w-full h-full top-[0] z-10 ">
        <div className="w-full h-screen bg-cover bg-center relative">
          <video
            className="w-full h-screen xl:h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={metaFields.banner_video_or_image} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 flex flex-col gap-4 lg:gap-10 justify-end text-white font-medium p-5 xl:p-10 ">
            <h1 className="w-full lg:w-[550px] text-[32px] leading-10 lg:text-[62px] lg:leading-[70px] font-heading">
              {metaFields.banner_title}
            </h1>
            <button
              onClick={handleContactUs}
              className="bg-red text-white text-base font-subHeading h-[42px] w-[175px] lg:w-[192px] rounded-lg hover:underline"
            >
              {JSON.parse(metaFields.banner_button_link).text}
            </button>
          </div>
        </div>

        <div className="w-full ">
          <div className="w-full flex flex-col px-5 lg:px-10">
            <div className="w-full flex flex-col items-start">
              <p className="py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
                Who We Are
              </p>
              <h1 className="font-heading leading-10 text-[28px] lg:text-[54px] lg:leading-[70px]">
                {metaFields.who_we_are_heading}
              </h1>
              <button
                className="bg-red text-white text-base font-subHeading h-[42px] w-[175px] lg:w-[192px] my-10 rounded-lg hover:underline"
                onClick={handleAboutUs}
              >
                {/* {JSON.parse(metaFields.who_we_are_link).text} */}Overview
              </button>
            </div>

            <div className="w-full flex gap-5 lg:gap-8 justify-between lg:justify-end mb-5 lg:mb-10 px-3 lg:px-0">
              <div className="w-[110px] sm:w-[170px] md:w-[200px] lg:w-[250px] h-[160px] sm:h-[250px] md:h-[300px] lg:h-[400px] bg-cover bg-center">
                <img
                  src={metaFields.who_we_are_image[0]}
                  className="w-full h-full object-contain" // Ensuring the image maintains aspect ratio
                  alt="Who are we Image 1"
                />
              </div>
              <div className="w-[245px] sm:w-[370px] md:w-[400px] lg:w-[600px] h-[160px] sm:h-[250px] md:h-[300px] lg:h-[400px] bg-cover bg-center">
                <img
                  src={metaFields.who_we_are_image[1]}
                  className="w-full h-full object-contain" // Ensuring the image maintains aspect ratio
                  alt="Who are we Image 2"
                />
              </div>
            </div>
          </div>

          {/* What we offer */}
          <div className="w-full flex flex-col px-5 lg:px-10 ">
            <CustomSlider
              title="What we offer"
              subTitle="We put our heart into delivering quality through our work"
              slides={slides}
            />
          </div>

          {/* Our business highlights */}
          <div className="w-full flex flex-col px-5 sm:px-8 md:px-10 lg:px-10">
            <div className="w-full flex flex-col items-start mb-5">
              <p className="py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
                Business Highlights
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-10">
              {businessCards.map((card, index) => (
                <div key={index} className="flex flex-col w-full h-full">
                  <Cards title={card.title} desc={card.description} />
                </div>
              ))}
            </div>
          </div>

          <OurProducts />
          <OurGlobalPresence />
        </div>
      </div>
    </div>
  );
};

export default Home;
