import EmollientsProducts from "@/sections/EmollientsProducts";
import OurGlobalPresence from "@/sections/OurGlobalPresence";
import React, { useEffect, useRef, useState } from 'react';
import '../index.css';
import Loader from "../pages/Loader";

const Emollients = ({language, setLoading}) => {
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
    const fetchEmollients = async () => {
      const query = `query {
          metaobjects(type: "emmolients", first: 50) {
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
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/emollients-api`, {
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

    fetchEmollients();
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

  const product4Title = metaFields.find(field => field.key === 'product_4_title')?.value || '';
  const product4Empirical = metaFields.find(field => field.key === 'product_4_empirical')?.value || '';
  const product4Cas = metaFields.find(field => field.key === 'product_4_cas')?.value || '';
  const product4Molecular = metaFields.find(field => field.key === 'product_4_molecular')?.value || '';
  const product4Desc = metaFields.find(field => field.key === 'product_4_desc')?.value || '';

  return (
    <div className="scrollContainer w-full lg:h-[1800px] h-[5000px] overflow-hidden bg-no-repeat" ref={svgContainerRef}>
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
        <EmollientsProducts 
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

          product4Title={product4Title}
          product4Empirical={product4Empirical}
          product4Cas={product4Cas}
          product4Molecular={product4Molecular}
          product4Desc={product4Desc}

          language={language}
        />
        {/* <OurGlobalPresence language={language}/> */}

      </div>
    </div>
  );
};

export default Emollients;
