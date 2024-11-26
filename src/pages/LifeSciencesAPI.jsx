import LifeSciencesAPIProducts from "@/sections/LifeSciencesAPIProducts";
import OurGlobalPresence from "@/sections/OurGlobalPresence";
import React, { useEffect, useState } from 'react';
import '../index.css';
import Footer from "../components/Footer";

//checking

const LifeSciencesAPI = () => {
  const [metaFields, setMetaFields] = useState([]); // Initialize as an empty array
  const [bannerVideo, setBannerVideo] = useState(''); // State for the banner video URL
  const [loading, setLoading] = useState(true); // Add loading state

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
          body: JSON.stringify({ query }),
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
        } else {
          console.error("Metaobjects not found in the response");
        }
        // console.log('Metaobjects response:', result);
        setLoading(false); // Set loading to false when the data has been fetched
      } catch (error) {
        console.error("Error fetching homepage meta fields:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchAPI();
  }, []);

  // Check if metaFields is empty and return loading state
  if (loading) {
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
  // console.log("Video URL set check:", bannerVideo);
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
    <div className='w-full bg-cover bg-center bg-white relative'>
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
      />
      <OurGlobalPresence />
      <Footer />
    </div>
  );
};

export default LifeSciencesAPI;
