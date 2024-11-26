import CustomSlider from '../sections/CustomSlider';
import  React, { useEffect, useRef, useState } from "react";
import Cards from '@/components/Cards';
import OurGlobalPresence from '@/sections/OurGlobalPresence';
import '../index.css';
import { descImage1, descImage2, descImage3, descImage4 } from '../lib/images';
import ButtonSlider from '../sections/ButtonSlider';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import Footer from "../components/Footer";

const HomeCareCosmetics = () => {
  // State to manage selected category
  const [activeCategory, setActiveCategory] = useState('Personal Care Solutions');

  const [metaFields, setMetaFields] = useState(null);
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();

  const [highlights, setHighlights] = useState([]);
  const [categories, setCategories] = useState({});
  const [showAlternateContent, setShowAlternateContent] = useState(false);

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
      const offset = pathLength - (pathLength * clampedPercentage * 0.5); // Adjust for desired speed

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

  const handleProductListing = (category) => {
    navigate(`/product-listing?category=${encodeURIComponent(category)}`);
  };

  useEffect(() => {
    const fetchLifesciences = async () => {
        const cosmeticsQuery = `query {
          metaobjects(type: "home_care_cosmetics", first: 50) {
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
                  }
                }
              }
            }
          }
        }`;

        const categoriesQuery = `query {
          metaobjects(type: "home_care_categories", first: 50) {
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
                  }
                }
              }
            }
          }
        }`;
  
    
        try {
            // Fetch cosmetics
            const cosmeticsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/home-care-cosmetics`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: cosmeticsQuery }),
            });

            const cosmeticsResult = await cosmeticsResponse.json();

            // Fetch categories
            const categoriesResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/home-care-cosmetics`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: categoriesQuery }),
            });
    
            const categoriesResult = await categoriesResponse.json();
            // console.log('Categories Response:', categoriesResult);      
    
            if (cosmeticsResult?.data && categoriesResult?.data) {
              // Process cosmetics
                const fields = {};
                const slidesArray1 = [];
                const highlights = []; 
                const categories = {};

                // Process home care cosmetics
                for (const edge of cosmeticsResult.data.metaobjects.edges) {
                  for (const field of edge.node.fields) {
                    if (field.key.startsWith('our_offerings_card')) {
                      const cardIndex = parseInt(field.key.split('_').pop(), 10) - 1;

                      if (!slidesArray1[cardIndex]) {
                          slidesArray1[cardIndex] = { id: cardIndex + 1 };
                      }

                      if (field.key.includes('title')) {
                          slidesArray1[cardIndex].title = field.value;
                      } else if (field.key.includes('image') && field.reference?.image?.url) {
                          slidesArray1[cardIndex].image = field.reference.image.url;
                      } else if (field.key.includes('link')) {
                          slidesArray1[cardIndex].link = field.value;
                      }
                    } 
                    
                    // Check for highlights
                    if (field.key.startsWith('highlight')) {
                      const index = field.key.match(/\d+/)[0]; // Extract number from key
                      highlights[index - 1] = highlights[index - 1] || {}; // Ensure array entry exists
                      if (field.key.includes('title')) {
                        highlights[index - 1].title = field.value;
                      } else if (field.key.includes('desc')) {
                        highlights[index - 1].desc = field.value;
                      }
                    } else {
                      fields[field.key] = field.value;
                    }

                    // Check for applications
                    if (field.key === 'application_header') {
                      fields.applications_title = field.value;
                    } else if (field.key === 'application_desc') {
                      fields.applications_desc = field.value;
                    }
                  }
                }

                // Process home care categories
                for (const edge of categoriesResult.data.metaobjects.edges) {
                  const node = edge.node;
                  const categoryKey = node.displayName.toLowerCase().replace(/\s+/g, '_'); // Convert displayName to a key format
              
                  categories[categoryKey] = {
                      title: node.displayName,
                      title1: '', // New title field
                      description1: '', // Initialize with empty string
                      description2: '',
                      description3: '', 
                      description4: '', 
                      images1: [],
                      images2: [],
                      images3: [], 
                      images4: [],
                  };
              
                  for (const field of node.fields) {
                    if (field.key === 'description_1') {
                      categories[categoryKey].description1 = field.value;
                    } else if (field.key === 'description_2') {
                      categories[categoryKey].description2 = field.value;
                    } else if (field.key === 'description_3') {
                      categories[categoryKey].description3 = field.value;
                    } else if (field.key === 'description_4') {
                      categories[categoryKey].description4 = field.value; 
                    } else if (field.key === 'images_1' && field.value) {
                      const parsedImages1 = JSON.parse(field.value);
                      categories[categoryKey].images1 = await Promise.all(parsedImages1.map(gid => fetchImage(gid)));
                    } else if (field.key === 'images_2' && field.value) {
                      const parsedImages2 = JSON.parse(field.value);
                      categories[categoryKey].images2 = await Promise.all(parsedImages2.map(gid => fetchImage(gid)));
                    } else if (field.key === 'images_3' && field.value) {
                      const parsedImages3 = JSON.parse(field.value);
                      categories[categoryKey].images3 = await Promise.all(parsedImages3.map(gid => fetchImage(gid))); 
                    } else if (field.key === 'images_4' && field.value) {
                      const parsedImages4 = JSON.parse(field.value);
                      categories[categoryKey].images4 = await Promise.all(parsedImages4.map(gid => fetchImage(gid))); 
                    } else if (field.key === 'title_1') {
                      categories[categoryKey].title1 = field.value; 
                    }
                  }
                }
    
                const imageFetchPromises = cosmeticsResult.data.metaobjects.edges.map(async (edge) => {
                  for (const field of edge.node.fields) {
                    if (field.reference?.image?.url) {
                        fields[field.key] = field.reference.image.url;
                    } else if (field.reference?.sources) {
                        fields[field.key] = field.reference.sources[0].url;
                    } else {
                        fields[field.key] = field.value;
                    }

                    // Check for GIDs and handle parsing
                    if (field.key === 'who_we_are_imgs') {
                      // console.log("GIDs for who_we_are_imgs:", fields[field.key]);
                      // Parse if it is a string
                      const gids = typeof fields[field.key] === 'string' ? JSON.parse(fields[field.key]) : fields[field.key];
                      if (Array.isArray(gids)) {
                          const imageUrls = await Promise.all(gids.map(gid => fetchImage(gid)));
                          fields[field.key] = imageUrls; // Set the image URLs
                      } else {
                          console.error("who_we_are_imgs is not an array");
                      }
                    }
                  }
                });
    
                await Promise.all(imageFetchPromises);
                setMetaFields(fields);
                setSlides(slidesArray1.filter(slide => slide.image && slide.title)); // Set slides state
                setHighlights(highlights.filter(h => h.title && h.desc));
                setCategories(categories);
                setActiveCategory(Object.keys(categories)[0]);
            
                // console.log("Fetched metaFields:", fields); 
                // console.log("Slides Array:", slidesArray1);
                // console.log("highlights:", highlights);
                console.log('Categories:', categories);
                
              } else {
                console.error("Metaobjects not found in the response");
            }

            // console.log('Metaobjects response:', result);
            // console.log('Fetched slides:', slides);

        } catch (error) {
            console.error("Error fetching homepage meta fields:", error);
        }
    };
    
    fetchLifesciences();
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

  return (
    <div className="scrollContainer w-full h-[5200px] overflow-hidden bg-no-repeat" ref={svgContainerRef}>
      <svg width="2100" height="5026" viewBox="250 0 2065 2800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M445.634 0.836114C454.975 -1.82847 462.56 2.21838 469.367 8.13043C488.641 24.884 511.766 69.8656 532.391 93.0475C808.928 403.971 1393.2 266.645 1760.87 255.937C1957.97 250.208 2318.88 285.83 2398.03 500.613C2406.61 523.911 2419.87 566.328 2410.06 589.326C2407.31 595.771 2399.84 599.652 2398.47 606.929C2397.1 614.207 2401.51 621.118 2401.51 628.562C2401.53 654.226 2360.77 702.521 2341.34 719.775C2184.33 859.232 1792.34 817.831 1592.58 812.286C1380.58 806.39 1169.45 800.978 956.952 796.565C710.279 791.435 294.654 755.18 117.475 962.668C-11.1398 1113.28 134.097 1314.31 285.465 1378.99C826.614 1610.25 1464.22 1200.98 2032.37 1356.91C2271.61 1422.56 2502.59 1627.33 2418.27 1895.62C2349.03 2115.92 2079.59 2213.46 1870.2 2250.3C1528.13 2310.47 1181.17 2264.73 837.306 2260.74C654.671 2258.61 378.337 2262.02 234.131 2385.51C78.438 2518.84 193.995 2674.38 343.86 2741.06C576.428 2844.55 976.073 2806.36 1232.76 2801.4C1489.45 2796.44 1899.47 2756.93 2141.8 2857.32C2448.08 2984.21 2356.99 3259.64 2114.91 3396.55C1545.75 3718.43 613.894 3033.77 132.205 3621.51C41.5291 3732.16 30.3467 3842.82 69.671 3977.2C141.546 4222.79 450.178 4339 679.908 4388.86C1123.1 4485.07 1685.04 4433.97 2044.71 4743.7C2104.27 4794.99 2165.43 4866.4 2185.63 4943.61C2191.21 4964.89 2204.38 5017.33 2174.44 5025.38C2143.46 5033.71 2136.19 4956.02 2129.06 4935.47C2068.27 4760.15 1824.82 4643.28 1657.34 4591.8C1240.99 4463.85 771.056 4519.94 369.789 4336.63C116.546 4220.94 -85.5317 3988.7 36.5798 3699.86C161.833 3403.65 512.729 3315.31 811.343 3325.52C1212.8 3339.23 1754.55 3559.52 2122.15 3339.78C2188.3 3300.24 2217.76 3276.09 2253.78 3207.42C2392.19 2943.5 2080.01 2861.6 1880.89 2846.06C1522.9 2818.1 1162.69 2855.54 804.84 2855.76C593.995 2855.89 254.924 2836.37 139.198 2629.57C12.8129 2403.71 302.83 2262.97 484.739 2233.04C810.347 2179.45 1163.93 2251.18 1495.31 2241.84C1754.18 2234.54 2212.41 2191.88 2354.27 1944.4C2472.83 1737.56 2354.01 1568.78 2170.8 1463.38C1858.02 1283.45 1393.61 1404.67 1056.55 1460.51C743.387 1512.41 315.161 1552.76 95.0933 1275.79C11.7318 1170.87 -19.9067 1071.12 64.6204 952.11C232.12 716.277 689.924 738.477 947.492 745.155C1247.69 752.932 1548.2 771.701 1848.66 773.932C1986.88 774.965 2237.93 777.746 2333.07 660.488C2340.04 651.894 2366.63 610.693 2368.22 602.183C2369.54 595.139 2363.4 552.622 2361.48 543.079C2333.61 404.904 2155.25 344.001 2031.73 321.552C1547 233.504 862.644 532.338 486.985 112.232C471.884 95.3457 428.928 42.7367 430.381 21.2368C430.82 14.692 439.249 2.63474 445.6 0.819495L445.634 0.836114Z" 
          fill="url(#paint0_angular_2834_3935)"
          fill-opacity="0.005"
          strokeOpacity="0.005"
          strokeWidth="21"
          speed="2"
          stay=".7"
          className="scrollPath cls-2"
          style={{ strokeDasharray: "80000", zIndex: 5 }}
          ref={pathRef}
          stroke-width="80"
        />
        <g filter="url(#filter0_b_2834_3935)">
          <path d="M445.634 0.836114C454.975 -1.82847 462.56 2.21838 469.367 8.13043C488.641 24.884 511.766 69.8656 532.391 93.0475C808.928 403.971 1393.2 266.645 1760.87 255.937C1957.97 250.208 2318.88 285.83 2398.03 500.613C2406.61 523.911 2419.87 566.328 2410.06 589.326C2407.31 595.771 2399.84 599.652 2398.47 606.929C2397.1 614.207 2401.51 621.118 2401.51 628.562C2401.53 654.226 2360.77 702.521 2341.34 719.775C2184.33 859.232 1792.34 817.831 1592.58 812.286C1380.58 806.39 1169.45 800.978 956.952 796.565C710.279 791.435 294.654 755.18 117.475 962.668C-11.1398 1113.28 134.097 1314.31 285.465 1378.99C826.614 1610.25 1464.22 1200.98 2032.37 1356.91C2271.61 1422.56 2502.59 1627.33 2418.27 1895.62C2349.03 2115.92 2079.59 2213.46 1870.2 2250.3C1528.13 2310.47 1181.17 2264.73 837.306 2260.74C654.671 2258.61 378.337 2262.02 234.131 2385.51C78.438 2518.84 193.995 2674.38 343.86 2741.06C576.428 2844.55 976.073 2806.36 1232.76 2801.4C1489.45 2796.44 1899.47 2756.93 2141.8 2857.32C2448.08 2984.21 2356.99 3259.64 2114.91 3396.55C1545.75 3718.43 613.894 3033.77 132.205 3621.51C41.5291 3732.16 30.3467 3842.82 69.671 3977.2C141.546 4222.79 450.178 4339 679.908 4388.86C1123.1 4485.07 1685.04 4433.97 2044.71 4743.7C2104.27 4794.99 2165.43 4866.4 2185.63 4943.61C2191.21 4964.89 2204.38 5017.33 2174.44 5025.38C2143.46 5033.71 2136.19 4956.02 2129.06 4935.47C2068.27 4760.15 1824.82 4643.28 1657.34 4591.8C1240.99 4463.85 771.056 4519.94 369.789 4336.63C116.546 4220.94 -85.5317 3988.7 36.5798 3699.86C161.833 3403.65 512.729 3315.31 811.343 3325.52C1212.8 3339.23 1754.55 3559.52 2122.15 3339.78C2188.3 3300.24 2217.76 3276.09 2253.78 3207.42C2392.19 2943.5 2080.01 2861.6 1880.89 2846.06C1522.9 2818.1 1162.69 2855.54 804.84 2855.76C593.995 2855.89 254.924 2836.37 139.198 2629.57C12.8129 2403.71 302.83 2262.97 484.739 2233.04C810.347 2179.45 1163.93 2251.18 1495.31 2241.84C1754.18 2234.54 2212.41 2191.88 2354.27 1944.4C2472.83 1737.56 2354.01 1568.78 2170.8 1463.38C1858.02 1283.45 1393.61 1404.67 1056.55 1460.51C743.387 1512.41 315.161 1552.76 95.0933 1275.79C11.7318 1170.87 -19.9067 1071.12 64.6204 952.11C232.12 716.277 689.924 738.477 947.492 745.155C1247.69 752.932 1548.2 771.701 1848.66 773.932C1986.88 774.965 2237.93 777.746 2333.07 660.488C2340.04 651.894 2366.63 610.693 2368.22 602.183C2369.54 595.139 2363.4 552.622 2361.48 543.079C2333.61 404.904 2155.25 344.001 2031.73 321.552C1547 233.504 862.644 532.338 486.985 112.232C471.884 95.3457 428.928 42.7367 430.381 21.2368C430.82 14.692 439.249 2.63474 445.6 0.819495L445.634 0.836114Z" 
          fill="white" fill-opacity="0.02"
          strokeOpacity="0.5"
          strokeWidth="21"
          speed="2"
          stay=".7"
          className="scrollPath cls-2"
          style={{ strokeDasharray: "80000", zIndex: 5 }}
          ref={pathRef}
          stroke-width="80"/>
        </g>
        <defs>
          <filter id="filter0_b_2834_3935" x="-72" y="-72" width="2580" height="5170" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="36"/>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_2834_3935"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_2834_3935" result="shape"/>
          </filter>
          <radialGradient id="paint0_angular_2834_3935" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1218.59 2337.99) rotate(-90) scale(2962 3004.37)">
            <stop offset="0.06" stop-color="#9D2924"/>
            <stop offset="0.265" stop-color="#EA5C50"/>
            <stop offset="0.515" stop-color="#E4A16B"/>
            <stop offset="0.76" stop-color="#80B2BD"/>
            <stop offset="0.96" stop-color="#D88BD3"/>
          </radialGradient>
        </defs>
      </svg>


      <div className="absolute w-full h-full top-[0] z-10 ">
        <div className='w-full bg-cover bg-center relative'>
          <div className='w-full flex h-[820px] lg:h-[800px] relative'>
            <div className='absolute inset-0 flex lg:flex-row flex-col gap-24 lg:justify-between items-center pt-28 lg:pt-10 px-5 lg:px-10'>
              <div className='flex flex-col gap-6 text-black font-medium'>
                <h1 className='w-full lg:text-[62px] text-[40px] lg:leading-[70px] leading-[50px] font-heading'>{metaFields.banner_title}</h1>
                <p className='text-[18px] font-subHeading leading-[26px] lg:w-[500px]'>
                  {metaFields.banner_desc}
                </p>
                <button className='bg-red text-white text-base font-subHeading h-[42px] w-[192px] rounded-lg' onClick={() => handleProductListing('HomeCareCosmetics')}>Explore Products</button>
              </div>
              <div className='w-full lg:w-[60%] h-[300px] lg:h-[600px] bg-cover bg-center'>
                <img src={metaFields.banner_img} className='w-full h-full'></img>
              </div>
            </div>
          </div>

          <div className='w-full'>
            {/* Who are we */}
            <div className='w-full flex flex-col px-5 lg:px-10 gap-20'>
              <div className='w-full flex flex-col items-start'>
                <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>Who are we</p>
                <h1 className='font-heading text-[28px] lg:text-[54px] leading-10 lg:leading-[70px]'>
                {metaFields.who_we_are_desc}
                </h1>
              </div>

              <div className='w-full flex gap-5 lg:gap-8 justify-between lg:justify-end mb-5 lg:mb-10 px-3 lg:px-0'>
                <div className='w-[110px] sm:w-[170px] md:w-[200px] lg:w-[250px] h-[160px] sm:h-[250px] md:h-[300px] lg:h-[400px] bg-cover bg-center'>            
                  <img src={metaFields.who_we_are_imgs[0]} className='w-full h-full'></img>
                </div>
                <div className='w-[245px] sm:w-[370px] md:w-[400px] lg:w-[600px] h-[160px] sm:h-[250px] md:h-[300px] lg:h-[400px] bg-cover bg-center'>
                  <img src={metaFields.who_we_are_imgs[1]} className='w-full h-full'></img>
                </div>
              </div>
            </div>

            {/* Our Current offering */}
            <div className='w-full flex flex-col px-5 lg:px-10'>
              <CustomSlider title='Our Brands' subTitle='Enhance your Aura with our Aura series' slides={slides} />
            </div>

            {/* Our Products highlights */}
            <div className='w-full flex flex-col px-5 lg:px-10'>
              <div className='w-full flex flex-col items-start'>
                <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>Our Product Highlights</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10 lg:pr-20">
                {highlights.map((highlight, index) => (
                  <Cards key={index} title={highlight.title} desc={highlight.desc} />
                ))}
              </div>
            </div>

            {/* Applications Section */}
            <div className='p-5 lg:p-10 w-full items-start grid grid-cols-12'>
              <p className='col-span-12 lg:col-span-5 py-3 sm:py-5 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[15px]'>
                {metaFields.application_header || 'Applications'} {/* Use fetched title */}
              </p>
              <div className='col-span-12 lg:col-span-7 py-3 sm:py-5 lg:py-10'>
                <p className='font-subHeading font-light text-[28px] lg:text-[20px] leading-8 sm:leading-10 md:leading-[60px] lg:leading-[30px]'>
                  {metaFields.application_desc || 'No description available.'} {/* Use fetched description */}
                </p>
              </div>
            </div>

            {/* Dynamic Content Section */}
            <div className="w-full flex flex-col px-5 lg:px-10 mt-10">
                {/* Top buttons */}
                <div className="hidden lg:flex justify-center flex-wrap gap:4 md:gap-4 lg:gap-4 py-5">
                  {Object.keys(categories).map((category) => (
                    <div key={category} className="flex flex-row items-center gap-5">
                      {/* Button for the main title */}
                      <button
                        onClick={() => {
                          setActiveCategory(category);
                          setShowAlternateContent(false); // Show default content
                        }}
                        className={`px-6 py-2 border rounded-md transition-all duration-300 ease-in-out w-[10rem] lg:w-[20rem] ${activeCategory === category && !showAlternateContent ? 'bg-red text-white shadow-lg' : 'bg-white text-black border border-gray-300 hover:bg-[#d2d3d3]'}`}
                      >
                        {categories[category].title}
                      </button>
                      
                      {/* Button for title1 (alternate content) */}
                      {categories[category].title1 && (
                        <button
                          onClick={() => {
                            setActiveCategory(category);
                            setShowAlternateContent(true); // Show alternate content
                          }}
                          className={`px-6 py-2 border rounded-md transition-all duration-300 ease-in-out w-[10rem] lg:w-[20rem] ${activeCategory === category && showAlternateContent ? 'bg-red text-white shadow-lg' : 'bg-white text-black border border-gray-300 hover:bg-[#d2d3d3]'}`}
                        >
                          {categories[category].title1}
                        </button>
                      )}
                    </div>
                  ))}
                </div>


                {/* Slider for smaller screens */}
                <div className="lg:hidden">
                  <ButtonSlider 
                    categories={categories} 
                    onCategorySelect={setActiveCategory} 
                    activeCategory={activeCategory} 
                    showAlternateContent={showAlternateContent}
                    setShowAlternateContent={setShowAlternateContent}
                  />
                </div>

                {/* Content based on active category */}
                <div className="content-section px-5 lg:px-10">
                  <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left content - Description1 */}
                    <div className="w-full flex lg:flex-row flex-col lg:justify-between items-center lg:w-1/2">
                      <div className='flex flex-col text-black'>
                        <h2 className="w-full font-heading text-2xl lg:text-4xl">Benefits</h2>
                        <p className="text-[#667085] font-subHeading text-[16px] mt-4">
                          {showAlternateContent
                            ? categories[activeCategory]?.description3 || 'No description available for this category.'
                            : categories[activeCategory]?.description1 || 'No description available for this category.'}
                        </p>
                      </div>
                    </div>

                    {/* Right content - Images1 */}
                    <div className="w-full flex gap-6 mt-12">
                      {showAlternateContent
                        ? categories[activeCategory]?.images3 && categories[activeCategory].images3.length > 0 ? (
                          categories[activeCategory].images3.map((img, index) => (
                            <div key={index}>
                              <img src={img} alt={activeCategory} className="object-cover" />
                            </div>
                          ))
                        ) : (
                          <p>No images available for this category.</p>
                        )
                        : categories[activeCategory]?.images1 && categories[activeCategory].images1.length > 0 ? (
                          categories[activeCategory].images1.map((img, index) => (
                            <div key={index}>
                              <img src={img} alt={activeCategory} className="object-cover" />
                            </div>
                          ))
                        ) : (
                          <p>No images available for this category.</p>
                        )}
                    </div>
                  </div>

                  {/* New section for Images2 and Description2 */}
                  <div className="flex flex-col lg:flex-row gap-10 mt-10">
                    {/* Left content - Images2 */}
                    <div className="w-full flex gap-6 mt-12 lg:mt-0 order-2 lg:order-1 mb-10">
                      {showAlternateContent
                        ? categories[activeCategory]?.images4 && categories[activeCategory].images4.length > 0 ? (
                          categories[activeCategory].images4.map((img, index) => (
                            <div key={index}>
                              <img src={img} alt={activeCategory} className="object-cover" />
                            </div>
                          ))
                        ) : (
                          <p>No images available for this category.</p>
                        )
                        : categories[activeCategory]?.images2 && categories[activeCategory].images2.length > 0 ? (
                          categories[activeCategory].images2.map((img, index) => (
                            <div key={index}>
                              <img src={img} alt={activeCategory} className="object-cover" />
                            </div>
                          ))
                        ) : (
                          <p>No images available for this category.</p>
                        )}
                    </div>

                    {/* Right content - Description2 */}
                    <div className="w-full flex lg:flex-row flex-col lg:justify-between items-center lg:w-1/2 order-1 lg:order-2">
                      <div className='flex flex-col text-black'>
                        <h2 className="w-full font-heading text-2xl lg:text-4xl">Use Cases</h2>
                        <p className="text-[#667085] font-subHeading text-[16px] mt-4">
                          {showAlternateContent
                            ? categories[activeCategory]?.description4 || 'No description available for this category.'
                            : categories[activeCategory]?.description2 || 'No description available for this category.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            {/* Our Global presence */}
            <OurGlobalPresence />
            <Footer />
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default HomeCareCosmetics;
