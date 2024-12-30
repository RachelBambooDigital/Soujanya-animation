import OurGlobalPresence from "@/sections/OurGlobalPresence";
import OurPurposeAboutUs from '@/sections/OurPurposeAboutUs';
import { drivers1, drivers2 } from '../lib/contants'
import React, { useEffect, useState, useRef } from 'react';
import ScrollableDrivers from '@/sections/ScrollableDrivers';
import { Link } from "react-router-dom";
import '../index.css';
import Loader from "../pages/Loader";

const AboutUs = ({language, setLoading}) => {
  const [metaFields, setMetaFields] = useState(null);
  const [scrollableDrivers, setScrollableDrivers] = useState([]);
  const [businessHighlights, setBusinessHighlights] = useState([]);
  const historyRef = useRef(null); // Create a ref

  const [svgContent, setSvgContent] = useState(""); // State to hold SVG content
  const svgContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const pathRef = useRef(null);

  const [viewBox, setViewBox] = useState("250 0 2436 5350");
  const [width, setWidth] = useState("2100");
  const [height, setHeight] = useState("5800");

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
      const offset = pathLength - pathLength * clampedPercentage * 0.6; // Adjust for desired speed

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
    const fetchAboutUs = async () => {
      const aboutUs1 = `query {
        metaobjects(type: "about_us", first: 50) {
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

      const aboutUs2 = `query {
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
        // Fetch both requests concurrently
        const [aboutUsResponse1, aboutUsResponse2] = await Promise.all([
          fetch(`${import.meta.env.VITE_BASE_URL}/shopify/aboutUs`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: aboutUs1, targetLanguage: language }),
          }),
          fetch(`${import.meta.env.VITE_BASE_URL}/shopify/aboutUs`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: aboutUs2, targetLanguage: language }),
          }),
        ]);
      
        // Parse the JSON responses
        const aboutUsResult1 = await aboutUsResponse1.json();
        const aboutUsResult2 = await aboutUsResponse2.json();
      
        // Combine the results of both responses
        const combinedResult = {
          data: {
            metaobjects: {
              edges: [
                ...aboutUsResult1.data.metaobjects.edges,
                ...aboutUsResult2.data.metaobjects.edges,
              ],
            },
          },
        };
      
        if (combinedResult && combinedResult.data && combinedResult.data.metaobjects) {
          const fields = {};
          const newDrivers = [];
          const newHighlights = [];
      
          const imageFetchPromises = combinedResult.data.metaobjects.edges.map(async (edge) => {
            for (const field of edge.node.fields) {
              if (field.key === 'highlights_heading') {
                fields[field.key] = field.value; // Extract highlights_heading
              }
      
              if (field.reference?.image?.url) {
                fields[field.key] = field.reference.image.url;
              } else if (field.reference?.sources) {
                fields[field.key] = field.reference.sources[0].url;
              } else {
                fields[field.key] = field.value;
              }
      
              // Check for GIDs and handle parsing
              if (field.key === 'who_we_are_imgs_line_1' || field.key === 'who_we_are_imgs_line_2') {
                const gids = typeof fields[field.key] === 'string' ? JSON.parse(fields[field.key]) : fields[field.key];
                if (Array.isArray(gids)) {
                  const imageUrls = await Promise.all(gids.map(gid => fetchImage(gid)));
                  fields[field.key] = imageUrls;
                } else {
                  console.error("who_we_are_image is not an array");
                }
              }      
            }
          });
      
          await Promise.all(imageFetchPromises);
          setMetaFields(fields);
      
          combinedResult.data.metaobjects.edges.forEach(edge => {
            edge.node.fields.forEach(field => {
              if (field.key.startsWith('card_') && field.key.endsWith('_title')) {
                const index = parseInt(field.key.split('_')[1]) - 1; // Convert to 0-based index
                const descKey = `card_${index + 1}_desc`; // Build the correct desc key
      
                // Check if the description exists in fields
                if (fields[descKey] !== undefined && fields[descKey] !== null) {
                  newDrivers[index] = { title: field.value, desc: fields[descKey] };
                } else {
                  newDrivers[index] = { title: field.value, desc: 'Description not available' }; // Fallback
                }
              }
      
              if (field.key.startsWith('highlights_title_')) {
                const index = parseInt(field.key.split('_')[2]) - 1;
                const descKey = `highlights_desc_${index + 1}`;
                const colorKey = `highlights_color_${index + 1}`; // Construct the corresponding color key
          
                if (fields[descKey] !== undefined && fields[descKey] !== null) {
                  newHighlights[index] = { 
                    title: field.value, 
                    desc: fields[descKey], 
                    color: fields[colorKey] // Add the color
                  };
                } else {
                  newHighlights[index] = { 
                    title: field.value, 
                    desc: 'Description not available', 
                    color: fields[colorKey] // Add the color
                  };
                }
              }
            });
          });
      
          setScrollableDrivers(newDrivers.filter(Boolean)); // Filter out any undefined values
          setBusinessHighlights(newHighlights.filter(Boolean));
          setLoading(false); // Set loading to false once data is fetched
        } else {
          console.error("Metaobjects not found in the response");
        }
      } catch (error) {
        console.error("Error fetching homepage meta fields:", error);
        setLoading(false); // Set loading to false even if there is an error
      }
      
    };

    fetchAboutUs();
  }, [language, setLoading]);
  
  // setViewBox("450 0 990 6000");
  //       setWidth("900");
  //       setHeight("8600");
  useEffect(() => {
    const updateSVGSize = () => {
      if (window.innerWidth <= 768) {
        setViewBox("250 0 1036 5100");
        setWidth("1000");
        setHeight("8600");
      } else {
        setViewBox("250 0 2436 4500");
        setWidth("2100");
        setHeight("5800");
      }
    };

    updateSVGSize(); // Initial check
    window.addEventListener("resize", updateSVGSize);

    return () => window.removeEventListener("resize", updateSVGSize);
  }, []);

  const fetchImage = async (gid) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/media/${encodeURIComponent(gid)}`);
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

  return (
    <div className="scrollContainer w-full lg:h-[6100px] overflow-hidden bg-no-repeat" ref={svgContainerRef}>
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M445.634 0.836114C454.975 -1.82847 462.56 2.21838 469.367 8.13043C488.641 24.884 511.766 69.8656 532.391 93.0475C808.928 403.971 1393.2 266.645 1760.87 255.937C1957.97 250.208 2318.88 285.83 2398.03 500.613C2406.61 523.911 2419.87 566.328 2410.06 589.326C2407.31 595.771 2399.84 599.652 2398.47 606.929C2397.1 614.207 2401.51 621.118 2401.51 628.562C2401.53 654.226 2360.77 702.521 2341.34 719.775C2184.33 859.232 1792.34 817.831 1592.58 812.286C1380.58 806.39 1169.45 800.978 956.952 796.565C710.279 791.435 294.654 755.18 117.475 962.668C-11.1398 1113.28 134.097 1314.31 285.465 1378.99C826.614 1610.25 1464.22 1200.98 2032.37 1356.91C2271.61 1422.56 2502.59 1627.33 2418.27 1895.62C2349.03 2115.92 2079.59 2213.46 1870.2 2250.3C1528.13 2310.47 1181.17 2264.73 837.306 2260.74C654.671 2258.61 378.337 2262.02 234.131 2385.51C78.438 2518.84 193.995 2674.38 343.86 2741.06C576.428 2844.55 976.073 2806.36 1232.76 2801.4C1489.45 2796.44 1899.47 2756.93 2141.8 2857.32C2448.08 2984.21 2356.99 3259.64 2114.91 3396.55C1545.75 3718.43 613.894 3033.77 132.205 3621.51C41.5291 3732.16 30.3467 3842.82 69.671 3977.2C141.546 4222.79 450.178 4339 679.908 4388.86C1123.1 4485.07 1685.04 4433.97 2044.71 4743.7C2104.27 4794.99 2165.43 4866.4 2185.63 4943.61C2191.21 4964.89 2204.38 5017.33 2174.44 5025.38C2143.46 5033.71 2136.19 4956.02 2129.06 4935.47C2068.27 4760.15 1824.82 4643.28 1657.34 4591.8C1240.99 4463.85 771.056 4519.94 369.789 4336.63C116.546 4220.94 -85.5317 3988.7 36.5798 3699.86C161.833 3403.65 512.729 3315.31 811.343 3325.52C1212.8 3339.23 1754.55 3559.52 2122.15 3339.78C2188.3 3300.24 2217.76 3276.09 2253.78 3207.42C2392.19 2943.5 2080.01 2861.6 1880.89 2846.06C1522.9 2818.1 1162.69 2855.54 804.84 2855.76C593.995 2855.89 254.924 2836.37 139.198 2629.57C12.8129 2403.71 302.83 2262.97 484.739 2233.04C810.347 2179.45 1163.93 2251.18 1495.31 2241.84C1754.18 2234.54 2212.41 2191.88 2354.27 1944.4C2472.83 1737.56 2354.01 1568.78 2170.8 1463.38C1858.02 1283.45 1393.61 1404.67 1056.55 1460.51C743.387 1512.41 315.161 1552.76 95.0933 1275.79C11.7318 1170.87 -19.9067 1071.12 64.6204 952.11C232.12 716.277 689.924 738.477 947.492 745.155C1247.69 752.932 1548.2 771.701 1848.66 773.932C1986.88 774.965 2237.93 777.746 2333.07 660.488C2340.04 651.894 2366.63 610.693 2368.22 602.183C2369.54 595.139 2363.4 552.622 2361.48 543.079C2333.61 404.904 2155.25 344.001 2031.73 321.552C1547 233.504 862.644 532.338 486.985 112.232C471.884 95.3457 428.928 42.7367 430.381 21.2368C430.82 14.692 439.249 2.63474 445.6 0.819495L445.634 0.836114Z"
          fill="url(#paint0_angular_2834_2821)"
          fill-opacity="0.005"
          strokeOpacity="0.005"
          strokeWidth="21"
          speed="2"
          stay=".7"
          className="scrollPath cls-1"
          style={{ strokeDasharray: "80000", zIndex: 5 }}
          ref={pathRef}
          stroke-width="80"
        />
        <g filter="url(#filter0_b_2834_2821)">
          <path
            d="M445.634 0.836114C454.975 -1.82847 462.56 2.21838 469.367 8.13043C488.641 24.884 511.766 69.8656 532.391 93.0475C808.928 403.971 1393.2 266.645 1760.87 255.937C1957.97 250.208 2318.88 285.83 2398.03 500.613C2406.61 523.911 2419.87 566.328 2410.06 589.326C2407.31 595.771 2399.84 599.652 2398.47 606.929C2397.1 614.207 2401.51 621.118 2401.51 628.562C2401.53 654.226 2360.77 702.521 2341.34 719.775C2184.33 859.232 1792.34 817.831 1592.58 812.286C1380.58 806.39 1169.45 800.978 956.952 796.565C710.279 791.435 294.654 755.18 117.475 962.668C-11.1398 1113.28 134.097 1314.31 285.465 1378.99C826.614 1610.25 1464.22 1200.98 2032.37 1356.91C2271.61 1422.56 2502.59 1627.33 2418.27 1895.62C2349.03 2115.92 2079.59 2213.46 1870.2 2250.3C1528.13 2310.47 1181.17 2264.73 837.306 2260.74C654.671 2258.61 378.337 2262.02 234.131 2385.51C78.438 2518.84 193.995 2674.38 343.86 2741.06C576.428 2844.55 976.073 2806.36 1232.76 2801.4C1489.45 2796.44 1899.47 2756.93 2141.8 2857.32C2448.08 2984.21 2356.99 3259.64 2114.91 3396.55C1545.75 3718.43 613.894 3033.77 132.205 3621.51C41.5291 3732.16 30.3467 3842.82 69.671 3977.2C141.546 4222.79 450.178 4339 679.908 4388.86C1123.1 4485.07 1685.04 4433.97 2044.71 4743.7C2104.27 4794.99 2165.43 4866.4 2185.63 4943.61C2191.21 4964.89 2204.38 5017.33 2174.44 5025.38C2143.46 5033.71 2136.19 4956.02 2129.06 4935.47C2068.27 4760.15 1824.82 4643.28 1657.34 4591.8C1240.99 4463.85 771.056 4519.94 369.789 4336.63C116.546 4220.94 -85.5317 3988.7 36.5798 3699.86C161.833 3403.65 512.729 3315.31 811.343 3325.52C1212.8 3339.23 1754.55 3559.52 2122.15 3339.78C2188.3 3300.24 2217.76 3276.09 2253.78 3207.42C2392.19 2943.5 2080.01 2861.6 1880.89 2846.06C1522.9 2818.1 1162.69 2855.54 804.84 2855.76C593.995 2855.89 254.924 2836.37 139.198 2629.57C12.8129 2403.71 302.83 2262.97 484.739 2233.04C810.347 2179.45 1163.93 2251.18 1495.31 2241.84C1754.18 2234.54 2212.41 2191.88 2354.27 1944.4C2472.83 1737.56 2354.01 1568.78 2170.8 1463.38C1858.02 1283.45 1393.61 1404.67 1056.55 1460.51C743.387 1512.41 315.161 1552.76 95.0933 1275.79C11.7318 1170.87 -19.9067 1071.12 64.6204 952.11C232.12 716.277 689.924 738.477 947.492 745.155C1247.69 752.932 1548.2 771.701 1848.66 773.932C1986.88 774.965 2237.93 777.746 2333.07 660.488C2340.04 651.894 2366.63 610.693 2368.22 602.183C2369.54 595.139 2363.4 552.622 2361.48 543.079C2333.61 404.904 2155.25 344.001 2031.73 321.552C1547 233.504 862.644 532.338 486.985 112.232C471.884 95.3457 428.928 42.7367 430.381 21.2368C430.82 14.692 439.249 2.63474 445.6 0.819495L445.634 0.836114Z"
            fill="white"
            fill-opacity="0.08"
            strokeOpacity="0.5"
            strokeWidth="21"
            speed="2"
            stay=".7"
            className="scrollPath cls-1"
            style={{ strokeDasharray: "80000", zIndex: 5 }}
            ref={pathRef}
            stroke-width="80"
          />
        </g>
        <defs>
          <filter
            id="filter0_b_2834_2821"
            x="-72"
            y="-72"
            width="2580"
            height="5170"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="36" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_2834_2821"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_2834_2821"
              result="shape"
            />
          </filter>
          <radialGradient
            id="paint0_angular_2834_2821"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1218.59 2337.99) rotate(-90) scale(2962 3004.37)"
          >
            <stop stop-color="#42AC51" />
            <stop offset="0.05" stop-color="#B0CD1A" />
            <stop offset="0.13" stop-color="#019ACC" />
            <stop offset="0.2" stop-color="#2C2982" />
            <stop offset="0.295" stop-color="#B80B79" />
            <stop offset="0.395" stop-color="#9D2924" />
            <stop offset="0.445" stop-color="#EA5C50" />
            <stop offset="0.51" stop-color="#E4A16B" />
            <stop offset="0.6" stop-color="#80B2BD" />
            <stop offset="0.645" stop-color="#D88BD3" />
            <stop offset="0.715" stop-color="#595FB3" />
            <stop offset="0.765" stop-color="#BF278C" />
            <stop offset="0.825" stop-color="#74BCD3" />
            <stop offset="0.915" stop-color="#5B75CA" />
            <stop offset="1" stop-color="#948EE8" />
          </radialGradient>
        </defs>
      </svg>

      {/* Main cotent */}
      <div className="absolute w-full h-full top-[0] z-10 ">
        <div className="w-full bg-cover bg-center relative" >
          <div className="w-full h-[635px] lg:h-[880px] bg-cover bg-center relative">
            {/* Breadcrumbs for Large Screens */}
            <div className="hidden lg:flex inset-x-0 top-20 bg-[#FAF8F8] text-black text-sm items-center space-x-4 px-28 h-8 relative z-10">
            <Link 
                to="/" 
                className={`hover:text-blue-500 ${location.pathname === "/" ? "font-bold" : ""}`}
            >
                Home
            </Link>
            <span className="text-gray-400"> &gt; </span>
            <Link 
                to="/about-us" 
                className={`hover:text-blue-500 ${location.pathname === "/about-us" ? "font-bold" : ""}`}
            >
                About Us
            </Link>
            </div>
            
            {/* Banner */}
            <div className="w-full flex h-full relative pt-28">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 w-full items-center lg:items-start px-5 lg:px-10">

                {/* Text Section */}
                <div className="flex flex-col gap-4 lg:gap-6 text-black items-start w-full max-w-full lg:pt-20">
                  <h1 className="font-heading leading-7 text-[24px] lg:text-[50px] lg:leading-[65px]">
                    {metaFields.banner_title}
                  </h1>
                  <p className="text-[16px] lg:text-[18px] font-subHeading leading-[24px] lg:w-[500px] text-[#667085]">
                    {metaFields.banner_desc}
                  </p>
                </div>

                {/* Images Section */}
                <div className="flex gap-3 lg:gap-8 justify-center lg:justify-start mt-5 lg:mt-0 px-3 lg:px-0 w-full max-w-full overflow-hidden">
                  <div className="w-[100%] lg:w-[350px] lg:h-[500px] bg-cover bg-center max-w-full overflow-hidden">
                    <img
                      src={metaFields.banner_img_1}
                      className="w-full h-auto max-w-full rounded-md"
                      alt="Hero Image 1"
                    />
                  </div>
                  <div className="w-[100%] lg:w-[350px] lg:h-[500px] bg-cover bg-center max-w-full overflow-hidden">
                    <img
                      src={metaFields.banner_img_2}
                      className="w-full h-auto max-w-full rounded-md"
                      alt="Hero Image 2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Who are we */}
          <div className='w-full flex flex-col px-5 lg:px-10'>
            <div className='w-[85%] flex flex-col items-start'>
              <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>{metaFields.who_we_are_1_title}</p>
              <h1 className='font-heading text-[28px] lg:text-[36px] leading-10 lg:leading-[45px]'>{metaFields.who_we_are_desc}</h1>
              <button className='bg-red text-white text-base font-subHeading h-[42px] w-[192px] rounded-lg mt-10 mb-10' 
                onClick={() => {
                  if (historyRef.current) {
                    historyRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}>
                  {metaFields.who_we_are_1_button_text}
              </button>
            </div>
          </div>

          <OurPurposeAboutUs language={language}/>

          {/* Business Highlights */}
          <div className="w-full flex flex-col gap-16 mb-16 px-5 lg:px-10">
            <div className="w-full flex flex-col items-start">
              <p className="py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
                {metaFields.business_highlights_title}
              </p>
              <h1 className="font-heading text-[28px] lg:text-[54px] leading-[38px] lg:leading-[70px]">
                {metaFields.highlights_heading}
              </h1>
            </div>

            <div className="w-full flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {businessHighlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex flex-col text-white p-6 gap-6 rounded-t-[42px] rounded-l-[42px] pt-20"
                    style={{
                      backgroundColor: highlight.color,
                      width: '100%', // Cards take up 100% width for smaller screens
                      maxWidth: '350px', // Max width of cards for large screens
                      minHeight: '450px', // Set a minimum height to prevent card collapse
                      height: 'auto', // Ensure dynamic height adjustment based on content
                    }}
                  >
                    <h1 className="text-[24px] sm:text-[32px] lg:text-[42px] lg:leading-[50px] font-heading sm:h-[6.8rem] md:h-[6.2rem] lg:h-[130px]">
                      {highlight.title}
                    </h1>
                    <p className="text-[18px] sm:text-[16px] font-subHeading leading-[20px] sm:leading-[24px] sm:h-[6.8rem] md:h-[6.2rem] lg:h-[130px]">
                      {highlight.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div ref={historyRef}>
            <ScrollableDrivers drivers2={scrollableDrivers} language={language}/>
          </div>

          {/* Who we are about us */} 
          <div className='hidden w-full lg:flex flex-col px-5 lg:px-10 bg-white'>
            <div className='w-full flex flex-col items-start'>
              <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>{metaFields.who_we_are_2_title}</p>
              <h1 className='font-heading leading-10 text-[28px] lg:text-[54px] lg:leading-[70px]'>{metaFields.who_we_are_title}</h1>
            </div>

            <div className='w-full flex gap-5 lg:gap-8 justify-between lg:justify-end mb-5 lg:mb-10 px-3 lg:px-0 mt-40'>
              {/* Image 1 */}
              <div className='w-full lg:w-[580px] h-auto max-h-[380px]'>
                <img src={metaFields.who_we_are_imgs_line_1[0]} className='w-full h-auto object-contain' alt="Who are we Image 1" />
              </div>
              {/* Image 2 */}
              <div className='w-full lg:w-[260px] h-auto max-h-[380px]'>
                <img src={metaFields.who_we_are_imgs_line_1[1]} className='w-full h-auto object-contain' alt="Who are we Image 2" />
              </div>
              {/* Image 3 */}
              <div className='w-full lg:w-[580px] h-auto max-h-[380px]'>
                <img src={metaFields.who_we_are_imgs_line_1[2]} className='w-full h-auto object-contain' alt="Who are we Image 3" />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 mt-10 ">
              {/* Left content - Description */}
              <div className="w-full flex lg:flex-row flex-col lg:justify-start items-center">
                <div className='flex flex-col text-black'>
                  <h2 className="w-full font-heading text-2xl lg:text-4xl">{metaFields.who_we_are_heading}</h2>
                  <p className="text-[#667085] font-normal text-[16px] mt-4">{metaFields.who_we_are_desc_2}</p>
                  <Link to="/career">
                    <button className='bg-red text-white text-base font-subHeading h-[42px] w-[192px] rounded-lg mt-10 mb-10'>{metaFields.who_we_are_2_button_text}</button>
                  </Link>
                </div>
              </div>

              {/* Right content - Images */}
              <div className="w-full flex gap-6 mt-12 mb-14">
                {/* Image 1 */}
                <div className='w-full lg:w-[580px] h-auto max-h-[380px]'>
                  <img src={metaFields.who_we_are_imgs_line_2[0]} className='w-full h-auto object-contain' alt="Who are we Image 2" />
                </div>
                {/* Image 2 */}
                <div className='w-full lg:w-[260px] h-auto max-h-[380px]'>
                  <img src={metaFields.who_we_are_imgs_line_2[1]} className='w-full h-auto object-contain' alt="Who are we Image 1" />
                </div>
              </div>
            </div>
          </div>

          {/* Who we are about us small screen*/} 
          <div className='lg:hidden w-full sm:flex flex-col px-5 lg:px-10 bg-white'>
            <div className='w-full flex flex-col items-start'>
              <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>Who we are</p>
              <h1 className='font-heading leading-10 text-[28px] lg:text-[54px] lg:leading-[70px]'>{metaFields.who_we_are_title}</h1>
            </div>

            <div className='w-full flex gap-5 lg:gap-8 justify-between lg:justify-end px-3 lg:px-0 mt-12'>
              {/* Image 1 */}
              <div className='w-full object-contain'>
                <img src={metaFields.who_we_are_imgs_line_1[0]} className='w-full h-full' alt="Who are we Image 1" />
              </div>
              {/* Image 2 */}
              <div className='w-[50%] object-contain'>
                <img src={metaFields.who_we_are_imgs_line_1[1]} className='w-full h-full' alt="Who are we Image 2" />
              </div>
            </div>
            <div className='w-full flex gap-5 lg:gap-8 justify-between lg:justify-end px-3 lg:px-0 mt-5'>
              {/* Image 3 */}
              <div className='w-full lg:w-[580px] h-auto max-h-[380px]'>
                <img src={metaFields.who_we_are_imgs_line_1[2]} className='w-full h-auto object-contain' alt="Who are we Image 3" />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 mt-10 ">
              {/* Left content - Description */}
              <div className="w-full flex lg:flex-row flex-col lg:justify-start items-center">
                <div className='flex flex-col text-black'>
                  <h2 className="w-full font-heading text-2xl lg:text-4xl">{metaFields.who_we_are_heading}</h2>
                  <p className="text-[#667085] font-normal text-[16px] mt-4">{metaFields.who_we_are_desc_2}</p>
                  <Link to="/career">
                    <button className='bg-red text-white text-base font-subHeading h-[42px] w-[192px] rounded-lg mt-10 mb-10'>Explore Careers</button>
                  </Link>
                </div>
              </div>

              {/* Right content - Images */}
              <div className="w-full flex gap-6 mt-5 mb-14">
                {/* Image 1 */}
                <div className='w-full object-contain'>
                  <img src={metaFields.who_we_are_imgs_line_2[0]} className='w-full h-full' alt="Who are we Image 2" />
                </div>
                {/* Image 2 */}
                <div className='w-[50%] object-contain'>
                  <img src={metaFields.who_we_are_imgs_line_2[1]} className='w-full h-full' alt="Who are we Image 1" />
                </div>
              </div>
            </div>
          </div>

          <OurGlobalPresence language={language}/>

        </div>
      </div>        
    </div>
  )
}

export default AboutUs