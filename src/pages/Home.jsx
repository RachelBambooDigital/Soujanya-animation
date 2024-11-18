import Cards from "@/components/Cards";
import  React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { businessCards, slides } from "../lib/contants";
import CustomSlider from "../sections/CustomSlider";
import OurProducts from "../sections/OurProducts";
import OurGlobalPresence from '@/sections/OurGlobalPresence';

const Home = () => {

  const [metaFields, setMetaFields] = useState(null);
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();   

  const [svgContent, setSvgContent] = useState(""); // State to hold SVG content
  const svgContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    if (!metaFields) return; // Ensure animation doesn't run until metaFields are set

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
      const offset = pathLength - (pathLength * clampedPercentage * 0.6); // Adjust for desired speed

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
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/homepage-meta`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });
    
            const result = await response.json();
    
            if (result && result.data && result.data.metaobjects) {
                const fields = {};
                const slidesArray = [];
    
                for (const edge of result.data.metaobjects.edges) {
                    for (const field of edge.node.fields) {
                        if (field.key.startsWith('what_we_offer_card')) {
                            const cardIndex = parseInt(field.key.split('_').pop(), 10) - 1;

                            if (!slidesArray[cardIndex]) {
                                slidesArray[cardIndex] = { id: cardIndex + 1 };
                            }

                            if (field.key.includes('title')) {
                                slidesArray[cardIndex].title = field.value;
                            } else if (field.key.includes('image') && field.reference?.image?.url) {
                                slidesArray[cardIndex].image = field.reference.image.url;
                            } else if (field.key.includes('link')) {
                                slidesArray[cardIndex].link = field.value;
                            }
                        } else {
                            fields[field.key] = field.value;
                        }
                    }
                }

                const imageFetchPromises = result.data.metaobjects.edges.map(async (edge) => {
                    for (const field of edge.node.fields) {
                        if (field.reference?.image?.url) {
                            fields[field.key] = field.reference.image.url;
                        } else if (field.reference?.sources) {
                            fields[field.key] = field.reference.sources[0].url;
                        } else {
                            fields[field.key] = field.value;
                        }
    
                        // Check for GIDs and handle parsing
                        if (field.key === 'who_we_are_image') {
                            // console.log("GIDs for who_we_are_image:", fields[field.key]);
                            // Parse if it is a string
                            const gids = typeof fields[field.key] === 'string' ? JSON.parse(fields[field.key]) : fields[field.key];
                            if (Array.isArray(gids)) {
                                const imageUrls = await Promise.all(gids.map(gid => fetchImage(gid)));
                                fields[field.key] = imageUrls; // Set the image URLs
                            } else {
                                console.error("who_we_are_image is not an array");
                            }
                        }
                    }
                });
    
                await Promise.all(imageFetchPromises);
                // console.log("Fetched metaFields:", fields); // Log to check the structure
                setMetaFields(fields);
                setSlides(slidesArray.filter(slide => slide.image && slide.title)); // Set slides state
                
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

  // Function to fetch image URL
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
      return (
          <div className="h-screen bg-black flex flex-col items-center justify-center px-8 sm:px-10 md:px-12 lg:px-20">
              {/* Logo */}
              <img
                  src="/logos/NavLogoWhite.svg"
                  alt="Loading Logo"
                  className="h-10 sm:h-12 md:h-16 lg:h-20"
              />
              <div className="relative mt-6 w-full max-w-4xl">
                  {/* Horizontal Progress Bar with Rounded Edges */}
                  <svg className="h-4 sm:h-6 md:h-8 lg:h-10 w-full" viewBox="0 0 100 10">
                      {/* Background Rectangle */}
                      <rect
                          x="0"
                          y="0"
                          width="100"
                          height="2"
                          fill="#d1d5db" // Light gray background color
                          rx="3" // Rounded corners
                          ry="3" // Rounded corners
                      />
                      {/* Filling Rectangle (animated) */}
                      <rect
                          x="0"
                          y="0"
                          width="0"
                          height="2"
                          fill="#4a5568" // Darker color for the progress bar
                          rx="3" // Rounded corners
                          ry="3" // Rounded corners
                          className="animate-fill"
                      />
                  </svg>
                  {/* Loading text (optional) */}
                  {/* <p className="text-white mt-2 text-center">Loading...</p> */}
              </div>
          </div>
      );
  } 

  // Redirect functions
  const handleContactUs = () => {
      navigate('/contact-us');
  };

  const handleAboutUs = () => {
      navigate('/about-us');
  };
  
  return (
    <div className="scrollContainer w-full h-[4900px] overflow-hidden bg-no-repeat" ref={svgContainerRef}>
        {/* <svg
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1920 5721"
        >
          <defs>
          <linearGradient 
          id="paint0_linear_2799_4192" 
          x1="956.35" y1="80.8297" 
          x2="955.65" y2="3308.96" 
          gradientUnits="userSpaceOnUse">

              <stop offset="0.0419835" stop-color="#42AC51" />
              <stop offset="0.108875" stop-color="#B0CD1A" />
              <stop offset="0.182294" stop-color="#019ACC" />
              <stop offset="0.229609" stop-color="#2C2982" />
              <stop offset="0.295" stop-color="#B80B79" />
              <stop offset="0.415994" stop-color="#9D2924" />
              <stop offset="0.482042" stop-color="#EA5C50" />
              <stop offset="0.530967" stop-color="#E4A16B" />
              <stop offset="0.627596" stop-color="#80B2BD" />
              <stop offset="0.689976" stop-color="#D88BD3" />
              <stop offset="0.758471" stop-color="#595FB3" />
              <stop offset="0.822074" stop-color="#BF278C" />
              <stop offset="0.880784" stop-color="#74BCD3" />
              <stop offset="0.950505" stop-color="#5B75CA" />
              <stop offset="1" stop-color="#948EE8" />
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
            d="M498.815 291.502C504.345 289.902 508.835 292.332 512.865 295.882C524.275 305.942 537.965 332.952 550.175 346.872C713.885 533.572 1059.78 451.112 1277.44 444.682C1394.12 441.242 1607.78 462.632 1654.64 591.602C1659.72 605.592 1667.57 631.062 1661.76 644.872C1660.13 648.742 1655.71 651.072 1654.9 655.442C1654.09 659.812 1656.7 663.962 1656.7 668.432C1656.71 683.842 1632.58 712.842 1621.08 723.202C1528.13 806.942 1296.07 782.082 1177.81 778.752C1052.31 775.212 927.315 771.962 801.515 769.312C655.485 766.232 409.435 744.462 304.545 869.052C228.405 959.492 314.385 1080.2 403.995 1119.04C724.355 1257.9 1101.82 1012.15 1438.17 1105.78C1579.8 1145.2 1716.54 1268.16 1666.62 1429.26C1625.63 1561.54 1466.12 1620.11 1342.16 1642.23C1139.66 1678.36 934.255 1650.9 730.685 1648.5C622.565 1647.22 458.975 1649.27 373.605 1723.42C281.435 1803.48 349.845 1896.88 438.565 1936.92C576.245 1999.06 812.835 1976.13 964.795 1973.15C1116.76 1970.17 1359.49 1946.45 1502.95 2006.73C1684.27 2082.92 1630.34 2248.31 1487.03 2330.52C1150.09 2523.8 598.425 2112.68 313.265 2465.6C259.585 2532.04 252.965 2598.49 276.245 2679.18C318.795 2826.65 501.505 2896.43 637.505 2926.37C899.875 2984.14 1232.55 2953.46 1445.47 3139.44C1480.73 3170.24 1516.94 3213.12 1528.9 3259.48C1532.2 3272.26 1540 3303.75 1522.27 3308.58C1503.93 3313.58 1499.63 3266.93 1495.41 3254.59C1459.42 3149.32 1315.3 3079.14 1216.15 3048.23C969.665 2971.4 691.465 3005.08 453.915 2895.01C303.995 2825.54 184.365 2686.09 256.655 2512.65C330.805 2334.78 538.535 2281.74 715.315 2287.87C952.975 2296.1 1273.7 2428.38 1491.32 2296.43C1530.48 2272.69 1547.92 2258.19 1569.24 2216.95C1651.18 2058.48 1466.37 2009.3 1348.49 1999.97C1136.56 1983.18 923.315 2005.66 711.465 2005.79C586.645 2005.87 385.915 1994.15 317.405 1869.97C242.585 1734.35 414.275 1649.84 521.965 1631.87C714.725 1599.69 924.045 1642.76 1120.23 1637.15C1273.48 1632.77 1544.75 1607.15 1628.73 1458.55C1698.92 1334.35 1628.58 1233 1520.12 1169.71C1334.95 1061.67 1060.02 1134.46 860.475 1167.99C675.085 1199.15 421.575 1223.38 291.295 1057.07C241.945 994.072 223.215 934.172 273.255 862.712C372.415 721.102 643.435 734.432 795.915 738.442C973.635 743.112 1151.54 754.382 1329.41 755.722C1411.24 756.342 1559.86 758.012 1616.18 687.602C1620.31 682.442 1636.05 657.702 1636.99 652.592C1637.77 648.362 1634.14 622.832 1633 617.102C1616.5 534.132 1510.91 497.562 1437.79 484.082C1150.83 431.212 745.685 610.652 523.295 358.392C514.355 348.252 488.925 316.662 489.785 303.752C490.045 299.822 495.035 292.582 498.795 291.492L498.815 291.502Z" fill="white" fill-opacity="0.08"/>
        <g filter="url(#filter0_b_2799_4192)">
            <path d="M498.815 291.502C504.345 289.902 508.835 292.332 512.865 295.882C524.275 305.942 537.965 332.952 550.175 346.872C713.885 533.572 1059.78 451.112 1277.44 444.682C1394.12 441.242 1607.78 462.632 1654.64 591.602C1659.72 605.592 1667.57 631.062 1661.76 644.872C1660.13 648.742 1655.71 651.072 1654.9 655.442C1654.09 659.812 1656.7 663.962 1656.7 668.432C1656.71 683.842 1632.58 712.842 1621.08 723.202C1528.13 806.942 1296.07 782.082 1177.81 778.752C1052.31 775.212 927.315 771.962 801.515 769.312C655.485 766.232 409.435 744.462 304.545 869.052C228.405 959.492 314.385 1080.2 403.995 1119.04C724.355 1257.9 1101.82 1012.15 1438.17 1105.78C1579.8 1145.2 1716.54 1268.16 1666.62 1429.26C1625.63 1561.54 1466.12 1620.11 1342.16 1642.23C1139.66 1678.36 934.255 1650.9 730.685 1648.5C622.565 1647.22 458.975 1649.27 373.605 1723.42C281.435 1803.48 349.845 1896.88 438.565 1936.92C576.245 1999.06 812.835 1976.13 964.795 1973.15C1116.76 1970.17 1359.49 1946.45 1502.95 2006.73C1684.27 2082.92 1630.34 2248.31 1487.03 2330.52C1150.09 2523.8 598.425 2112.68 313.265 2465.6C259.585 2532.04 252.965 2598.49 276.245 2679.18C318.795 2826.65 501.505 2896.43 637.505 2926.37C899.875 2984.14 1232.55 2953.46 1445.47 3139.44C1480.73 3170.24 1516.94 3213.12 1528.9 3259.48C1532.2 3272.26 1540 3303.75 1522.27 3308.58C1503.93 3313.58 1499.63 3266.93 1495.41 3254.59C1459.42 3149.32 1315.3 3079.14 1216.15 3048.23C969.665 2971.4 691.465 3005.08 453.915 2895.01C303.995 2825.54 184.365 2686.09 256.655 2512.65C330.805 2334.78 538.535 2281.74 715.315 2287.87C952.975 2296.1 1273.7 2428.38 1491.32 2296.43C1530.48 2272.69 1547.92 2258.19 1569.24 2216.95C1651.18 2058.48 1466.37 2009.3 1348.49 1999.97C1136.56 1983.18 923.315 2005.66 711.465 2005.79C586.645 2005.87 385.915 1994.15 317.405 1869.97C242.585 1734.35 414.275 1649.84 521.965 1631.87C714.725 1599.69 924.045 1642.76 1120.23 1637.15C1273.48 1632.77 1544.75 1607.15 1628.73 1458.55C1698.92 1334.35 1628.58 1233 1520.12 1169.71C1334.95 1061.67 1060.02 1134.46 860.475 1167.99C675.085 1199.15 421.575 1223.38 291.295 1057.07C241.945 994.072 223.215 934.172 273.255 862.712C372.415 721.102 643.435 734.432 795.915 738.442C973.635 743.112 1151.54 754.382 1329.41 755.722C1411.24 756.342 1559.86 758.012 1616.18 687.602C1620.31 682.442 1636.05 657.702 1636.99 652.592C1637.77 648.362 1634.14 622.832 1633 617.102C1616.5 534.132 1510.91 497.562 1437.79 484.082C1150.83 431.212 745.685 610.652 523.295 358.392C514.355 348.252 488.925 316.662 489.785 303.752C490.045 299.822 495.035 292.582 498.795 291.492L498.815 291.502Z" fill="white" fill-opacity="0.08"/>
        </g>
        </svg> */}




        {/* <svg width="1350" height="3600" viewBox="0 0 1893 3600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M498.409 291.502C503.939 289.902 508.429 292.332 512.459 295.882C523.869 305.942 537.559 332.952 549.769 346.872C713.479 533.572 1059.37 451.112 1277.03 444.682C1393.71 441.242 1607.37 462.632 1654.23 591.602C1659.31 605.592 1667.16 631.062 1661.35 644.872C1659.72 648.742 1655.3 651.072 1654.49 655.442C1653.68 659.812 1656.29 663.962 1656.29 668.432C1656.3 683.842 1632.17 712.842 1620.67 723.202C1527.72 806.942 1295.66 782.082 1177.4 778.752C1051.9 775.212 926.909 771.962 801.109 769.312C655.079 766.232 409.029 744.462 304.139 869.052C227.999 959.492 313.979 1080.2 403.589 1119.04C723.949 1257.9 1101.41 1012.15 1437.76 1105.78C1579.39 1145.2 1716.13 1268.16 1666.21 1429.26C1625.22 1561.54 1465.71 1620.11 1341.75 1642.23C1139.25 1678.36 933.849 1650.9 730.279 1648.5C622.159 1647.22 458.569 1649.27 373.199 1723.42C281.029 1803.48 349.439 1896.88 438.159 1936.92C575.839 1999.06 812.429 1976.13 964.389 1973.15C1116.35 1970.17 1359.08 1946.45 1502.54 2006.73C1683.86 2082.92 1629.93 2248.31 1486.62 2330.52C1149.68 2523.8 598.019 2112.68 312.859 2465.6C259.179 2532.04 252.559 2598.49 275.839 2679.18C318.389 2826.65 501.099 2896.43 637.099 2926.37C899.469 2984.14 1232.14 2953.46 1445.06 3139.44C1480.32 3170.24 1516.53 3213.12 1528.49 3259.48C1531.79 3272.26 1539.59 3303.75 1521.86 3308.58C1503.52 3313.58 1499.22 3266.93 1495 3254.59C1459.01 3149.32 1314.89 3079.14 1215.74 3048.23C969.259 2971.4 691.059 3005.08 453.509 2895.01C303.589 2825.54 183.959 2686.09 256.249 2512.65C330.399 2334.78 538.129 2281.74 714.909 2287.87C952.569 2296.1 1273.29 2428.38 1490.91 2296.43C1530.07 2272.69 1547.51 2258.19 1568.83 2216.95C1650.77 2058.48 1465.96 2009.3 1348.08 1999.97C1136.15 1983.18 922.909 2005.66 711.059 2005.79C586.239 2005.87 385.509 1994.15 316.999 1869.97C242.179 1734.35 413.869 1649.84 521.559 1631.87C714.319 1599.69 923.639 1642.76 1119.82 1637.15C1273.07 1632.77 1544.34 1607.15 1628.32 1458.55C1698.51 1334.35 1628.17 1233 1519.71 1169.71C1334.54 1061.67 1059.61 1134.46 860.069 1167.99C674.679 1199.15 421.169 1223.38 290.889 1057.07C241.539 994.072 222.809 934.172 272.849 862.712C372.009 721.102 643.029 734.432 795.509 738.442C973.229 743.112 1151.13 754.382 1329 755.722C1410.83 756.342 1559.45 758.012 1615.77 687.602C1619.9 682.442 1635.64 657.702 1636.58 652.592C1637.36 648.362 1633.73 622.832 1632.59 617.102C1616.09 534.132 1510.5 497.562 1437.38 484.082C1150.42 431.212 745.279 610.652 522.889 358.392C513.949 348.252 488.519 316.662 489.379 303.752C489.639 299.822 494.629 292.582 498.389 291.492L498.409 291.502Z"
                fill="url(#paint0_linear_2799_4192)"
                strokeOpacity="0.8"
                strokeWidth="21"
                speed="2"
                stay=".7"
                className="scrollPath cls-1"
                style={{ strokeDasharray: "80000", zIndex: 5 }}
                ref={pathRef}
                stroke-width="80"
            /> */}
            {/* <g filter="url(#filter0_b_2799_4192)">
                <path 
                    d="M498.815 291.502C504.345 289.902 508.835 292.332 512.865 295.882C524.275 305.942 537.965 332.952 550.175 346.872C713.885 533.572 1059.78 451.112 1277.44 444.682C1394.12 441.242 1607.78 462.632 1654.64 591.602C1659.72 605.592 1667.57 631.062 1661.76 644.872C1660.13 648.742 1655.71 651.072 1654.9 655.442C1654.09 659.812 1656.7 663.962 1656.7 668.432C1656.71 683.842 1632.58 712.842 1621.08 723.202C1528.13 806.942 1296.07 782.082 1177.81 778.752C1052.31 775.212 927.315 771.962 801.515 769.312C655.485 766.232 409.435 744.462 304.545 869.052C228.405 959.492 314.385 1080.2 403.995 1119.04C724.355 1257.9 1101.82 1012.15 1438.17 1105.78C1579.8 1145.2 1716.54 1268.16 1666.62 1429.26C1625.63 1561.54 1466.12 1620.11 1342.16 1642.23C1139.66 1678.36 934.255 1650.9 730.685 1648.5C622.565 1647.22 458.975 1649.27 373.605 1723.42C281.435 1803.48 349.845 1896.88 438.565 1936.92C576.245 1999.06 812.835 1976.13 964.795 1973.15C1116.76 1970.17 1359.49 1946.45 1502.95 2006.73C1684.27 2082.92 1630.34 2248.31 1487.03 2330.52C1150.09 2523.8 598.425 2112.68 313.265 2465.6C259.585 2532.04 252.965 2598.49 276.245 2679.18C318.795 2826.65 501.505 2896.43 637.505 2926.37C899.875 2984.14 1232.55 2953.46 1445.47 3139.44C1480.73 3170.24 1516.94 3213.12 1528.9 3259.48C1532.2 3272.26 1540 3303.75 1522.27 3308.58C1503.93 3313.58 1499.63 3266.93 1495.41 3254.59C1459.42 3149.32 1315.3 3079.14 1216.15 3048.23C969.665 2971.4 691.465 3005.08 453.915 2895.01C303.995 2825.54 184.365 2686.09 256.655 2512.65C330.805 2334.78 538.535 2281.74 715.315 2287.87C952.975 2296.1 1273.7 2428.38 1491.32 2296.43C1530.48 2272.69 1547.92 2258.19 1569.24 2216.95C1651.18 2058.48 1466.37 2009.3 1348.49 1999.97C1136.56 1983.18 923.315 2005.66 711.465 2005.79C586.645 2005.87 385.915 1994.15 317.405 1869.97C242.585 1734.35 414.275 1649.84 521.965 1631.87C714.725 1599.69 924.045 1642.76 1120.23 1637.15C1273.48 1632.77 1544.75 1607.15 1628.73 1458.55C1698.92 1334.35 1628.58 1233 1520.12 1169.71C1334.95 1061.67 1060.02 1134.46 860.475 1167.99C675.085 1199.15 421.575 1223.38 291.295 1057.07C241.945 994.072 223.215 934.172 273.255 862.712C372.415 721.102 643.435 734.432 795.915 738.442C973.635 743.112 1151.54 754.382 1329.41 755.722C1411.24 756.342 1559.86 758.012 1616.18 687.602C1620.31 682.442 1636.05 657.702 1636.99 652.592C1637.77 648.362 1634.14 622.832 1633 617.102C1616.5 534.132 1510.91 497.562 1437.79 484.082C1150.83 431.212 745.685 610.652 523.295 358.392C514.355 348.252 488.925 316.662 489.785 303.752C490.045 299.822 495.035 292.582 498.795 291.492L498.815 291.502Z"
                    fill="white" fill-opacity="0.08"
                />
            </g> */}
            {/* <defs>
                <filter id="filter0_b_2799_4192" x="181" y="237" width="1550.11" height="3125.96" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="27"/>
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_2799_4192"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_2799_4192" result="shape"/>
                </filter>
                <linearGradient id="paint0_linear_2799_4192" x1="956.35" y1="80.8297" x2="955.65" y2="3308.96" gradientUnits="userSpaceOnUse">
                    <stop offset="0.0419835" stop-color="#42AC51"/>
                    <stop offset="0.108875" stop-color="#B0CD1A"/>
                    <stop offset="0.182294" stop-color="#019ACC"/>
                    <stop offset="0.229609" stop-color="#2C2982"/>
                    <stop offset="0.295" stop-color="#B80B79"/>
                    <stop offset="0.415994" stop-color="#9D2924"/>
                    <stop offset="0.482042" stop-color="#EA5C50"/>
                    <stop offset="0.530967" stop-color="#E4A16B"/>
                    <stop offset="0.627596" stop-color="#80B2BD"/>
                    <stop offset="0.689976" stop-color="#D88BD3"/>
                    <stop offset="0.758471" stop-color="#595FB3"/>
                    <stop offset="0.822074" stop-color="#BF278C"/>
                    <stop offset="0.880784" stop-color="#74BCD3"/>
                    <stop offset="0.950505" stop-color="#5B75CA"/>
                    <stop offset="1" stop-color="#948EE8"/>
                </linearGradient>
            </defs>
        </svg> */}

        <svg width="2100" height="5800" viewBox="250 0 2436 5350" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <g 
                filter="url(#filter0_b_2834_2821)">
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
                <filter id="filter0_b_2834_2821" x="-72" y="-72" width="2580" height="5170" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="36"/>
                    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_2834_2821"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_2834_2821" result="shape"/>
                </filter>
                <radialGradient id="paint0_angular_2834_2821" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1218.59 2337.99) rotate(-90) scale(2962 3004.37)">
                    <stop stop-color="#42AC51"/>
                    <stop offset="0.05" stop-color="#B0CD1A"/>
                    <stop offset="0.13" stop-color="#019ACC"/>
                    <stop offset="0.2" stop-color="#2C2982"/>
                    <stop offset="0.295" stop-color="#B80B79"/>
                    <stop offset="0.395" stop-color="#9D2924"/>
                    <stop offset="0.445" stop-color="#EA5C50"/>
                    <stop offset="0.51" stop-color="#E4A16B"/>
                    <stop offset="0.6" stop-color="#80B2BD"/>
                    <stop offset="0.645" stop-color="#D88BD3"/>
                    <stop offset="0.715" stop-color="#595FB3"/>
                    <stop offset="0.765" stop-color="#BF278C"/>
                    <stop offset="0.825" stop-color="#74BCD3"/>
                    <stop offset="0.915" stop-color="#5B75CA"/>
                    <stop offset="1" stop-color="#948EE8"/>
                </radialGradient>
            </defs>
        </svg>

      {/* Main content */}
      <div className="absolute w-full h-full top-[0] z-10 ">
        <div className="w-full h-screen bg-cover bg-center relative">
          <video
            className='w-full h-screen xl:h-full object-cover'
            autoPlay
            loop
            muted
            playsInline>
            <source src={metaFields.banner_video_or_image} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
         
          <div className='absolute inset-0 flex flex-col gap-4 lg:gap-10 justify-end text-white font-medium p-5 xl:p-10 '>
              <h1 className='w-full lg:w-[550px] text-[32px] leading-10 lg:text-[62px] lg:leading-[70px] font-heading'>
                  {metaFields.banner_title}
              </h1>
              <button
                  onClick={handleContactUs}
                  className='bg-red text-white text-base font-subHeading h-[42px] w-[175px] lg:w-[192px] rounded-lg hover:underline'>
                  {JSON.parse(metaFields.banner_button_link).text}
              </button>
          </div>
        </div>

        <div className='w-full '>
          <div className='w-full flex flex-col px-5 lg:px-10'>
              <div className='w-full flex flex-col items-start'>
                  <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>Who We Are</p>
                  <h1 className='font-heading leading-10 text-[28px] lg:text-[54px] lg:leading-[70px]'>
                      {metaFields.who_we_are_heading}
                  </h1>
                  <button className='bg-red text-white text-base font-subHeading h-[42px] w-[175px] lg:w-[192px] my-10 rounded-lg hover:underline' onClick={handleAboutUs}>
                      {/* {JSON.parse(metaFields.who_we_are_link).text} */}Overview
                  </button>
              </div>

              <div className='w-full flex gap-5 lg:gap-8 justify-between lg:justify-end mb-5 lg:mb-10 px-3 lg:px-0'>
                  <div className='w-[110px] sm:w-[170px] md:w-[200px] lg:w-[250px] h-[160px] sm:h-[250px] md:h-[300px] lg:h-[400px] bg-cover bg-center'>
                      <img
                          src={metaFields.who_we_are_image[0]}
                          className='w-full h-full object-contain'  // Ensuring the image maintains aspect ratio
                          alt="Who are we Image 1"
                      />
                  </div>
                  <div className='w-[245px] sm:w-[370px] md:w-[400px] lg:w-[600px] h-[160px] sm:h-[250px] md:h-[300px] lg:h-[400px] bg-cover bg-center'>
                      <img
                          src={metaFields.who_we_are_image[1]}
                          className='w-full h-full object-contain'  // Ensuring the image maintains aspect ratio
                          alt="Who are we Image 2"
                      />
                  </div>
              </div>
          </div>


          {/* What we offer */}
          <div className='w-full flex flex-col px-5 lg:px-10 '>
            <CustomSlider title="What we offer" subTitle="We put our heart into delivering quality through our work" slides={slides} />
          </div>

          {/* Our business highlights */}
          <div className='w-full flex flex-col px-5 sm:px-8 md:px-10 lg:px-10'>
              <div className='w-full flex flex-col items-start mb-5'>
                  <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>
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