import CustomSlider from "../sections/CustomSlider";
import React, { useEffect, useRef, useState } from "react";
import { productCards, lifeSciencesSlides } from "../lib/contants";
import { drivers } from "../lib/contants";
import Cards from "@/components/Cards";
import OurGlobalPresence from "@/sections/OurGlobalPresence";
import { lifeSciImgs, lifeSciImg1, lifeSciImg2 } from "../lib/images";
import "../index.css";
import { useNavigate } from "react-router-dom";
import Loader from "../pages/Loader";

const LifeSciences = ({ language, setLoading }) => {
  const [metaFields, setMetaFields] = useState(null);
  const [slides, setSlides] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);

  const svgContainerRef = useRef(null);
  const pathRef = useRef(null);

  const handleProductListing = (category) => {
    navigate(`/product-listing2?category=${encodeURIComponent(category)}`);
  };

  useEffect(() => {
    if (!metaFields) return; // Ensure animation doesn't run until metaFields are set

    const path = pathRef.current;
    if (!path) return;

    const pathLength = path.getTotalLength(); // Get the total length of the path

    const handleOffset = (mPercent) => {
      const distance = window.scrollY;
      const totalDistance = document.body.scrollHeight - window.innerHeight;
      const percentage =
        typeof mPercent === "number" ? mPercent : distance / totalDistance;

      // Clamp percentage value to ensure it doesn't exceed [0, 1] range
      const clampedPercentage = Math.min(Math.max(percentage, 0), 1);

      // Update the strokeDasharray and strokeDashoffset values
      const offset = pathLength - pathLength * clampedPercentage * 0.57; // Adjust for desired speed

      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = offset;
    };

    window.addEventListener("scroll", () => handleOffset());

    // Trigger initially
    handleOffset(0);

    return () => {
      window.removeEventListener("scroll", () => handleOffset());
    };
  }, [metaFields]); // Run this effect only when `metaFields` is set

  useEffect(() => {
    const fetchLifesciences = async () => {
      const lifesciences1 = `{
        metaobjects(type: "lifesciences", first: 50) {
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

      const lifesciences2 = `{
        metaobjects(type: "lifesciences_2", first: 50) {
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
        // Fetch both requests concurrently
        const [lifesciencesResponse1, lifesciencesResponse2] =
          await Promise.all([
            fetch(`${import.meta.env.VITE_BASE_URL}/shopify/lifesciences`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: lifesciences1,
                targetLanguage: language,
              }),
            }),
            fetch(`${import.meta.env.VITE_BASE_URL}/shopify/lifesciences`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: lifesciences2,
                targetLanguage: language,
              }),
            }),
          ]);

        // Parse the JSON responses
        const lifesciencesResult1 = await lifesciencesResponse1.json();
        const lifesciencesResult2 = await lifesciencesResponse2.json();

        // Combine the results of both responses
        const combinedResult = {
          data: {
            metaobjects: {
              edges: [
                ...lifesciencesResult1.data.metaobjects.edges,
                ...lifesciencesResult2.data.metaobjects.edges,
              ],
            },
          },
        };

        if (
          combinedResult &&
          combinedResult.data &&
          combinedResult.data.metaobjects
        ) {
          const fields = {};
          const slidesArray1 = [];
          const newDrivers = [];
          const highlights = [];

          const imageFetchPromises = combinedResult.data.metaobjects.edges.map(
            async (edge) => {
              for (const field of edge.node.fields) {
                if (field.key === "highlights_heading") {
                  fields[field.key] = field.value; // Extract highlights_heading
                }

                if (field.reference?.image?.url) {
                  fields[field.key] = field.reference.image.url;
                } else if (field.reference?.sources) {
                  fields[field.key] = field.reference.sources[0].url;
                } else {
                  fields[field.key] = field.value;
                }

                // Handle GIDs and fetching image URLs
                if (field.key === "lifesciences") {
                  const gids =
                    typeof fields[field.key] === "string"
                      ? JSON.parse(fields[field.key])
                      : fields[field.key];
                  if (Array.isArray(gids)) {
                    const imageUrls = await Promise.all(
                      gids.map((gid) => fetchImage(gid))
                    );
                    fields[field.key] = imageUrls;
                  } else {
                    console.error("lifesciences is not an array");
                  }
                }
              }
            }
          );

          await Promise.all(imageFetchPromises);

          setMetaFields(fields); // Set the fields for meta data

          combinedResult.data.metaobjects.edges.forEach((edge) => {
            edge.node.fields.forEach((field) => {
              // Handle category cards (e.g., API, Emollients)
              if (field.key.startsWith("our_categories_card")) {
                const cardIndex = parseInt(field.key.split("_").pop(), 10) - 1;

                if (!slidesArray1[cardIndex]) {
                  slidesArray1[cardIndex] = { id: cardIndex + 1 };
                }

                if (field.key.includes("title")) {
                  slidesArray1[cardIndex].title = field.value;
                } else if (
                  field.key.includes("image") &&
                  field.reference?.image?.url
                ) {
                  slidesArray1[cardIndex].image = field.reference.image.url;
                } else if (field.key.includes("link")) {
                  slidesArray1[cardIndex].link = field.value;
                }
              }

              // Handle highlights (e.g., Quality Control, R&D)
              if (field.key.startsWith("highlight")) {
                const index = field.key.match(/\d+/)[0]; // Extract number from key
                highlights[index - 1] = highlights[index - 1] || {}; // Ensure array entry exists
                if (field.key.includes("title")) {
                  highlights[index - 1].title = field.value;
                } else if (field.key.includes("desc")) {
                  highlights[index - 1].desc = field.value;
                }
              }

              // Handle drivers (e.g., Sustainability, Precision)
              for (let i = 1; i <= 4; i++) {
                const titleKey = `drivers_title_${i}`;
                const descKey = `drivers_desc_${i}`;
                const colorKey = `drivers_color_${i}`;

                const title =
                  fields[titleKey] || `Driver ${i} title not available`;
                const desc = fields[descKey] || "Description not available";
                const color = fields[colorKey] || "gray";

                // Ensure drivers are unique before adding to the array
                if (
                  !newDrivers.some(
                    (driver) => driver.title === title && driver.desc === desc
                  )
                ) {
                  newDrivers.push({
                    title,
                    desc,
                    color,
                  });
                }
              }
            });
          });

          setSlides(slidesArray1.filter((slide) => slide.image && slide.title)); // Set slides data
          setHighlights(highlights.filter((h) => h.title && h.desc)); // Set highlights data
          setDrivers(newDrivers); // Set drivers data (no need for `.filter(Boolean)` since we avoid duplicates now)
          setLoading(false); // Set loading to false once data is fetched
        } else {
          console.error("Metaobjects not found in the response");
        }
      } catch (error) {
        console.error("Error fetching lifesciences meta fields:", error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchLifesciences();
  }, [language, setLoading]);

  // width="2436" height="5026" viewBox="250 0 1965 3600"
  const [viewBox, setViewBox] = useState("250 0 1965 3600");
  const [width, setWidth] = useState("2136");
  const [height, setHeight] = useState("5026");

  useEffect(() => {
    const updateSVGSize = () => {
      if (window.innerWidth <= 768) {
        setViewBox("470 0 990 5500");
        setWidth("900");
        setHeight("5900");
      } else {
        setViewBox("250 0 1965 3600");
        setWidth("2136");
        setHeight("5026");
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
        console.log("Fetched Image URL:", data.url);
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

  return (
    <div
      className="scrollContainer w-full lg:h-[4000px] overflow-hidden bg-no-repeat"
      ref={svgContainerRef}
    >
      <svg
        width="2436"
        height="5026"
        viewBox="0 0 2436 5026"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeOpacity="0.55"
          strokeWidth="21"
          speed="2"
          stay=".7"
          className="scrollPath cls-4"
          style={{ strokeDasharray: "80000", zIndex: 5 }}
          ref={pathRef}
          stroke-width="80"
          d="M445.634 0.836114C454.975 -1.82847 462.56 2.21838 469.367 8.13043C488.641 24.884 511.766 69.8656 532.391 93.0475C808.928 403.971 1393.2 266.645 1760.87 255.937C1957.97 250.208 2318.88 285.83 2398.03 500.613C2406.61 523.911 2419.87 566.328 2410.06 589.326C2407.31 595.771 2399.84 599.652 2398.47 606.929C2397.1 614.207 2401.51 621.118 2401.51 628.562C2401.53 654.226 2360.77 702.521 2341.34 719.775C2184.33 859.232 1792.34 817.831 1592.58 812.286C1380.58 806.39 1169.45 800.978 956.952 796.565C710.279 791.435 294.654 755.18 117.475 962.668C-11.1398 1113.28 134.097 1314.31 285.465 1378.99C826.614 1610.25 1464.22 1200.98 2032.37 1356.91C2271.61 1422.56 2502.59 1627.33 2418.27 1895.62C2349.03 2115.92 2079.59 2213.46 1870.2 2250.3C1528.13 2310.47 1181.17 2264.73 837.306 2260.74C654.671 2258.61 378.337 2262.02 234.131 2385.51C78.438 2518.84 193.995 2674.38 343.86 2741.06C576.428 2844.55 976.073 2806.36 1232.76 2801.4C1489.45 2796.44 1899.47 2756.93 2141.8 2857.32C2448.08 2984.21 2356.99 3259.64 2114.91 3396.55C1545.75 3718.43 613.894 3033.77 132.205 3621.51C41.5291 3732.16 30.3467 3842.82 69.671 3977.2C141.546 4222.79 450.178 4339 679.908 4388.86C1123.1 4485.07 1685.04 4433.97 2044.71 4743.7C2104.27 4794.99 2165.43 4866.4 2185.63 4943.61C2191.21 4964.89 2204.38 5017.33 2174.44 5025.38C2143.46 5033.71 2136.19 4956.02 2129.06 4935.47C2068.27 4760.15 1824.82 4643.28 1657.34 4591.8C1240.99 4463.85 771.056 4519.94 369.789 4336.63C116.546 4220.94 -85.5317 3988.7 36.5798 3699.86C161.833 3403.65 512.729 3315.31 811.343 3325.52C1212.8 3339.23 1754.55 3559.52 2122.15 3339.78C2188.3 3300.24 2217.76 3276.09 2253.78 3207.42C2392.19 2943.5 2080.01 2861.6 1880.89 2846.06C1522.9 2818.1 1162.69 2855.54 804.84 2855.76C593.995 2855.89 254.924 2836.37 139.198 2629.57C12.8129 2403.71 302.83 2262.97 484.739 2233.04C810.347 2179.45 1163.93 2251.18 1495.31 2241.84C1754.18 2234.54 2212.41 2191.88 2354.27 1944.4C2472.83 1737.56 2354.01 1568.78 2170.8 1463.38C1858.02 1283.45 1393.61 1404.67 1056.55 1460.51C743.387 1512.41 315.161 1552.76 95.0933 1275.79C11.7318 1170.87 -19.9067 1071.12 64.6204 952.11C232.12 716.277 689.924 738.477 947.492 745.155C1247.69 752.932 1548.2 771.701 1848.66 773.932C1986.88 774.965 2237.93 777.746 2333.07 660.488C2340.04 651.894 2366.63 610.693 2368.22 602.183C2369.54 595.139 2363.4 552.622 2361.48 543.079C2333.61 404.904 2155.25 344.001 2031.73 321.552C1547 233.504 862.644 532.338 486.985 112.232C471.884 95.3457 428.928 42.7367 430.381 21.2368C430.82 14.692 439.249 2.63474 445.6 0.819495L445.634 0.836114Z"
          fill="url(#paint0_angular_2834_4237)"
        />
        <defs>
          <radialGradient
            id="paint0_angular_2834_4237"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1218.59 2337.99) rotate(-90) scale(2962 3004.37)"
          >
            <stop offset="0.06" stop-color="#595FB3" />
            <stop offset="0.265" stop-color="#BE288C" />
            <stop offset="0.515" stop-color="#74BCD3" />
            <stop offset="0.76" stop-color="#5B75CA" />
            <stop offset="0.96" stop-color="#948EE8" />
          </radialGradient>
        </defs>
      </svg>

      <div className="absolute w-full h-full top-[0] z-10 ">
        <div className="w-full bg-cover bg-center relative">
          <div className="w-full flex items-center justify-center py-28 px-5 lg:px-10 bg-opacity-10 backdrop-blur-lg bg-white">
            <div className="max-w-[1440px] w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
              {/* Left: Text Content */}
              <div className="flex flex-col gap-6 text-black font-medium lg:w-1/2 w-full">
                <h1 className="w-full lg:text-[62px] text-[40px] lg:leading-[70px] leading-[50px] font-heading max-w-md">
                  {metaFields.banner_title}
                </h1>
                <p className="text-[18px] font-subHeading leading-[26px]">
                  {metaFields.banner_desc}
                </p>
                <button
                  className="bg-red text-white text-base font-subHeading h-[42px] w-[192px] rounded-lg"
                  onClick={() => handleProductListing("LifeSciences")}
                >
                  {metaFields.banner_button_text}
                </button>
              </div>

              {/* Right: Image */}
              <div className="w-full lg:w-1/2 flex justify-center items-center">
                <img
                  src={metaFields.banner_img}
                  alt="Banner"
                  className="max-w-full max-h-[600px] w-auto h-auto object-contain"
                />
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Who are we */}
            <div className="w-full flex flex-col px-5 lg:px-10 gap-20">
              <div className="w-full flex flex-col items-start">
                <p className="py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
                  {metaFields.who_we_are_title}
                </p>
                <h1 className="font-heading text-[28px] lg:text-[54px] leading-10 lg:leading-[70px]">
                  {metaFields.who_we_are_desc}
                </h1>
              </div>

              <div className="w-full flex gap-5 lg:gap-8 justify-between lg:justify-end mb-5 lg:mb-10 px-3 lg:px-0">
                {/* <div className='w-[217px] h-[376px] bg-cover bg-center' style={{ backgroundImage: `url("${heroSecImg1}")` }}></div> */}
                <div className="w-[110px] lg:w-[250px] h-[160px] lg:h-[400px] bg-cover bg-center">
                  <img
                    src={metaFields.who_we_are_img_1}
                    className="w-full h-full"
                  ></img>
                </div>
                {/* <div className='w-[714px] h-[476px] bg-cover bg-center' style={{ backgroundImage: `url("${heroSecImg2}")` }}></div> */}
                <div className="w-[245px] lg:w-[600px] h-[160px] lg:h-[400px] bg-cover bg-center">
                  <img
                    src={metaFields.who_we_are_img_2}
                    className="w-full h-full"
                  ></img>
                </div>
              </div>
            </div>

            {/* Our Drivers */}
            <div className="w-full flex flex-col gap-20 mb-16 px-5 lg:px-10">
              <div className="w-full flex flex-col items-start">
                <p className="py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
                  {metaFields.our_drivers_title}
                </p>
                <h1 className="font-heading text-[28px] lg:text-[54px] leading-[38px] lg:leading-[70px]">
                  {metaFields.our_drivers_desc}
                </h1>
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:px-20 gap-[16px]">
                {drivers.map((driver, index) => (
                  <div
                    key={index}
                    className="flex flex-col text-white p-4 pt-20 gap-4 rounded-t-[42px] rounded-l-[42px]"
                    style={{
                      backgroundColor: driver.color,
                      width: "100%",
                      maxWidth: "350px",
                      minHeight: "500px", // Increased from 500px to give breathing space
                      height: "auto", // Let height be flexible
                      border: "2px solid black",
                    }}
                  >
                    <h1 className="text-[24px] sm:text-[32px] lg:text-[42px] lg:leading-[50px] font-heading mb-4 break-words">
                      {driver.title}
                    </h1>
                    <p className="text-[18px] sm:text-[16px] font-subHeading leading-[24px]">
                      {driver.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Our business highlights */}
            <div className="w-full flex flex-col px-5 lg:px-10">
              <div className="w-full flex flex-col items-start">
                <p className="py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
                  {metaFields.lifesciences_highlights_title}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10 lg:pr-20">
                {highlights.map((highlight, index) => (
                  <Cards
                    key={index}
                    title={highlight.title}
                    desc={highlight.desc}
                  />
                ))}
              </div>
            </div>

            {/* Our Current offering */}
            <div className="w-full flex flex-col px-5 lg:px-10">
              <CustomSlider
                language={language}
                title={metaFields.our_categories_title}
                subTitle={metaFields.our_categories_desc}
                slides={slides}
              />
            </div>

            {/* Our Global presence */}
            {/* <OurGlobalPresence language={language}/> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeSciences;
