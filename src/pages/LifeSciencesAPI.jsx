import LifeSciencesAPIProducts from "@/sections/LifeSciencesAPIProducts";
import OurGlobalPresence from "@/sections/OurGlobalPresence";
import React, { useEffect, useRef, useState } from 'react';
import '../index.css';
import Loader from "../pages/Loader";

const LifeSciencesAPI = ({language, setLoading}) => {
  const [metaFields, setMetaFields] = useState([]); // Initialize as an empty array
  const [bannerVideo, setBannerVideo] = useState(''); // State for the banner video URL
  const [loading, setLoadings] = useState(true); // Add loading state

  const svgContainerRef = useRef(null);
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
      const offset = pathLength - (pathLength * clampedPercentage * 0.4); // Adjust for desired speed

      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = offset;
    };

    window.addEventListener("scroll", () => handleOffset());
    
    // Trigger initially
    handleOffset(0);

    return () => {
      window.removeEventListener("scroll", () => handleOffset());
    };
  }, [metaFields]);

  useEffect(() => {
    const fetchAPI = async () => {
      const query = `query {
          metaobjects(type: "lifescience_api", first: 50) {
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
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/lifescience-api`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, targetLanguage: language }),
        });

        const result = await response.json();

        if (result && result.data && result.data.metaobjects) {
          const fields = result.data.metaobjects.edges[0].node.fields;
          console.log("Fetched metaFields:", fields);
          setMetaFields(fields);

          // Extract the banner video URL
          const videoField = fields.find(field => field.key === 'banner_video');
          if (videoField && videoField.reference) {
            const videoSource = videoField.reference.sources[0]?.url;
            if (videoSource) {
              setBannerVideo(videoSource);
            }
          }
          setLoading(false); // Set loading to false once data is fetched
        } else {
          console.error("Metaobjects not found in the response");
        }
        // console.log('Metaobjects response:', result);
        setLoadings(false); // Set loading to false when the data has been fetched
      } catch (error) {
        console.error("Error fetching homepage meta fields:", error);
        setLoading(false); // Set loading to false even if there is an error
        setLoadings(false); // Set loading to false even if there's an error
      }
    };

    fetchAPI();
  }, [language, setLoading]);

  if (loading) {
    return <Loader />;
  }

  // Access the values using the correct keys
  const bannerTitle = metaFields.find(field => field.key === 'banner_title')?.value || '';
  const bannerDesc = metaFields.find(field => field.key === 'banner_desc')?.value || '';
  const applicationTitle = metaFields.find(field => field.key === 'application_title')?.value || '';
  const applicationDesc = metaFields.find(field => field.key === 'application_desc')?.value || '';
  const product1Title = metaFields.find(field => field.key === 'product_1_title')?.value || '';
  const product1Empirical = metaFields.find(field => field.key === 'product_1_empirical')?.value || '';
  const product1Cas = metaFields.find(field => field.key === 'product_1_cas')?.value || '';
  const product1Molecular = metaFields.find(field => field.key === 'product_1_molecular')?.value || '';
  const product1Desc = metaFields.find(field => field.key === 'product_1_desc')?.value || '';

  const product2Title = metaFields.find(field => field.key === 'product_2_title')?.value || '';
  const product2Empirical = metaFields.find(field => field.key === 'product_2_empirical')?.value || '';
  const product2Cas = metaFields.find(field => field.key === 'product_2_cas')?.value || '';
  const product2Molecular = metaFields.find(field => field.key === 'product_2_molecular')?.value || '';
  const product2Desc = metaFields.find(field => field.key === 'product_2_desc')?.value || '';

  const product3Title = metaFields.find(field => field.key === 'product_3_title')?.value || '';
  const product3Empirical = metaFields.find(field => field.key === 'product_3_empirical')?.value || '';
  const product3Cas = metaFields.find(field => field.key === 'product_3_cas')?.value || '';
  const product3Molecular = metaFields.find(field => field.key === 'product_3_molecular')?.value || '';
  const product3Desc = metaFields.find(field => field.key === 'product_3_desc')?.value || '';

  return (
    <div className="scrollContainer w-full lg:h-[2320px] h-[5000px] overflow-hidden bg-no-repeat" ref={svgContainerRef}>
      <svg 
            width="2436" 
            height="5026" 
            viewBox="450 0 2436 7026" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg">

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
      fill="url(#paint0_angular_2834_4237)"/>
      <defs>
      <radialGradient id="paint0_angular_2834_4237" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1218.59 2337.99) rotate(-90) scale(2962 3004.37)">
      <stop offset="0.06" stop-color="#595FB3"/>
      <stop offset="0.265" stop-color="#BE288C"/>
      <stop offset="0.515" stop-color="#74BCD3"/>
      <stop offset="0.76" stop-color="#5B75CA"/>
      <stop offset="0.96" stop-color="#948EE8"/>
      </radialGradient>
      </defs>
      </svg>
      <div className='w-full absolute h-full top-[0] z-10'>
        <div className='w-full h-[100dvh] lg:h-screen bg-cover bg-center relative'>
          <video
            className='w-full h-[100dvh] xl:h-full object-cover '
            autoPlay
            loop
            muted
            playsInline>
            <source src={bannerVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          

          <div className='absolute inset-0 flex flex-col gap-[27px] lg:gap-10 justify-end text-white font-medium p-5 xl:p-10 bg-black/30'>
            <h1 className='w-full lg:w-[650px] text-[32px] leading-10 lg:text-[62px] lg:leading-[70px] font-heading'>
              {bannerTitle}
            </h1>
            <p className="w-full lg:w-[650px] font-subHeading text-[14px] leading-[22px] lg:text-[18px] lg:leading-[26px]">
              {bannerDesc}
            </p>
          </div>
        </div>
        <LifeSciencesAPIProducts 
          applicationTitle={applicationTitle}
          applicationDesc={applicationDesc}
          product1Title={product1Title}
          product1Empirical={product1Empirical}
          product1Cas={product1Cas}
          product1Molecular={product1Molecular}
          product1Desc={product1Desc}

          product2Title={product2Title}
          product2Empirical={product2Empirical}
          product2Cas={product2Cas}
          product2Molecular={product2Molecular}
          product2Desc={product2Desc}

          product3Title={product3Title}
          product3Empirical={product3Empirical}
          product3Cas={product3Cas}
          product3Molecular={product3Molecular}
          product3Desc={product3Desc}

          language={language}
        />
        {/* <OurGlobalPresence language={language}/> */}
      </div>
    </div>
  );
};

export default LifeSciencesAPI;
