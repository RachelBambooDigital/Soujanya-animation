import IntermediateProducts from "@/sections/IntermediateProducts";
import OurGlobalPresence from "@/sections/OurGlobalPresence";
import React, { useEffect, useRef, useState } from "react";
import "../index.css";
import Loader from "../pages/Loader";

const Intermediate = ({ language, setLoading }) => {
  const [metaFields, setMetaFields] = useState([]); // Initialize as an empty array
  const [additionalProducts, setAdditionalProducts] = useState([]); // New state for additional products
  const [bannerVideo, setBannerVideo] = useState(""); // State for the banner video URL
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
      const percentage =
        typeof mPercent === "number" ? mPercent : distance / totalDistance;

      // Clamp percentage value to ensure it doesn't exceed [0, 1] range
      const clampedPercentage = Math.min(Math.max(percentage, 0), 1);

      // Update the strokeDasharray and strokeDashoffset values
      const offset = pathLength - pathLength * clampedPercentage * 0.4; // Adjust for desired speed

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
    const fetchIntermediate = async () => {
      // First query for products 1-7
      const query = `query {
          metaobjects(type: "intermediate", first: 50) {
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

      // Second query for products 8-12
      const query2 = `query {
          metaobjects(type: "intermediate2", first: 50) {
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
        // First fetch for main products data
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/shopify/intermediate-api`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, targetLanguage: language }),
          }
        );

        const result = await response.json();

        // Second fetch for additional products data
        const response2 = await fetch(
          `${import.meta.env.VITE_BASE_URL}/shopify/intermediate-api`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: query2, targetLanguage: language }),
          }
        );

        const result2 = await response2.json();

        if (result && result.data && result.data.metaobjects) {
          const fields = result.data.metaobjects.edges[0].node.fields;
          console.log("Fetched metaFields:", fields);
          setMetaFields(fields);

          // Extract the banner video URL
          const videoField = fields.find(
            (field) => field.key === "banner_video"
          );
          if (videoField && videoField.reference) {
            const videoSource = videoField.reference.sources[0]?.url;
            if (videoSource) {
              setBannerVideo(videoSource);
            }
          }
        } else {
          console.error("Metaobjects not found in the response");
        }

        // Process additional products data from second query
        if (
          result2 &&
          result2.data &&
          result2.data.metaobjects &&
          result2.data.metaobjects.edges.length > 0
        ) {
          const additionalFields =
            result2.data.metaobjects.edges[0].node.fields;
          console.log("Fetched additional products:", additionalFields);
          setAdditionalProducts(additionalFields);
        } else {
          console.error(
            "Additional products metaobjects not found in the response"
          );
        }

        setLoadings(false); // Set loading to false when the data has been fetched
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching intermediate data:", error);
        setLoading(false); // Set loading to false even if there is an error
        setLoadings(false); // Set loading to false even if there's an error
      }
    };

    fetchIntermediate();
  }, [language, setLoading]);

  if (loading) {
    return <Loader />;
  }

  // Access the values using the correct keys for primary products (1-7)
  const bannerTitle =
    metaFields.find((field) => field.key === "banner_title")?.value || "";
  const bannerDesc =
    metaFields.find((field) => field.key === "banner_desc")?.value || "";
  const applicationTitle =
    metaFields.find((field) => field.key === "application_title")?.value || "";
  const applicationDesc =
    metaFields.find((field) => field.key === "application_desc")?.value || "";
  const product1Title =
    metaFields.find((field) => field.key === "product_1_title")?.value || "";
  const product1Empirical =
    metaFields.find((field) => field.key === "product_1_empirical")?.value ||
    "";
  const product1Cas =
    metaFields.find((field) => field.key === "product_1_cas")?.value || "";
  const product1Molecular =
    metaFields.find((field) => field.key === "product_1_molecular")?.value ||
    "";
  const product1Desc =
    metaFields.find((field) => field.key === "product_1_desc")?.value || "";

  const product2Title =
    metaFields.find((field) => field.key === "product_2_title")?.value || "";
  const product2Empirical =
    metaFields.find((field) => field.key === "product_2_empirical")?.value ||
    "";
  const product2Cas =
    metaFields.find((field) => field.key === "product_2_cas")?.value || "";
  const product2Molecular =
    metaFields.find((field) => field.key === "product_2_molecular")?.value ||
    "";
  const product2Desc =
    metaFields.find((field) => field.key === "product_2_desc")?.value || "";

  const product3Title =
    metaFields.find((field) => field.key === "product_3_title")?.value || "";
  const product3Empirical =
    metaFields.find((field) => field.key === "product_3_empirical")?.value ||
    "";
  const product3Cas =
    metaFields.find((field) => field.key === "product_3_cas")?.value || "";
  const product3Molecular =
    metaFields.find((field) => field.key === "product_3_molecular")?.value ||
    "";
  const product3Desc =
    metaFields.find((field) => field.key === "product_3_desc")?.value || "";

  const product4Title =
    metaFields.find((field) => field.key === "product_4_title")?.value || "";
  const product4Empirical =
    metaFields.find((field) => field.key === "product_4_empirical")?.value ||
    "";
  const product4Cas =
    metaFields.find((field) => field.key === "product_4_cas")?.value || "";
  const product4Molecular =
    metaFields.find((field) => field.key === "product_4_molecular")?.value ||
    "";
  const product4Desc =
    metaFields.find((field) => field.key === "product_4_desc")?.value || "";

  const product5Title =
    metaFields.find((field) => field.key === "product_5_title")?.value || "";
  const product5Empirical =
    metaFields.find((field) => field.key === "product_5_empirical")?.value ||
    "";
  const product5Cas =
    metaFields.find((field) => field.key === "product_5_cas")?.value || "";
  const product5Molecular =
    metaFields.find((field) => field.key === "product_5_molecular")?.value ||
    "";
  const product5Desc =
    metaFields.find((field) => field.key === "product_5_desc")?.value || "";

  const product6Title =
    metaFields.find((field) => field.key === "product_6_title")?.value || "";
  const product6Empirical =
    metaFields.find((field) => field.key === "product_6_empirical")?.value ||
    "";
  const product6Cas =
    metaFields.find((field) => field.key === "product_6_cas")?.value || "";
  const product6Molecular =
    metaFields.find((field) => field.key === "product_6_molecular")?.value ||
    "";
  const product6Desc =
    metaFields.find((field) => field.key === "product_6_desc")?.value || "";

  const product7Title =
    metaFields.find((field) => field.key === "product_7_title")?.value || "";
  const product7Empirical =
    metaFields.find((field) => field.key === "product_7_empirical")?.value ||
    "";
  const product7Cas =
    metaFields.find((field) => field.key === "product_7_cas")?.value || "";
  const product7Molecular =
    metaFields.find((field) => field.key === "product_7_molecular")?.value ||
    "";
  const product7Desc =
    metaFields.find((field) => field.key === "product_7_desc")?.value || "";

  // Access the values for additional products (8-12) from additionalProducts state
  const product8Title =
    additionalProducts.find((field) => field.key === "product8title")?.value ||
    "";
  const product8Empirical =
    additionalProducts.find((field) => field.key === "product8empirical")
      ?.value || "";
  const product8Cas =
    additionalProducts.find((field) => field.key === "product8cas")?.value ||
    "";
  const product8Molecular =
    additionalProducts.find((field) => field.key === "product8molecular")
      ?.value || "";
  const product8Desc =
    additionalProducts.find((field) => field.key === "product8desc")?.value ||
    "";

  const product9Title =
    additionalProducts.find((field) => field.key === "product9title")?.value ||
    "";
  const product9Empirical =
    additionalProducts.find((field) => field.key === "product9empirical")
      ?.value || "";
  const product9Cas =
    additionalProducts.find((field) => field.key === "product9cas")?.value ||
    "";
  const product9Molecular =
    additionalProducts.find((field) => field.key === "product9molecular")
      ?.value || "";
  const product9Desc =
    additionalProducts.find((field) => field.key === "product9desc")?.value ||
    "";

  const product10Title =
    additionalProducts.find((field) => field.key === "product10title")?.value ||
    "";
  const product10Empirical =
    additionalProducts.find((field) => field.key === "product10empirical")
      ?.value || "";
  const product10Cas =
    additionalProducts.find((field) => field.key === "product10cas")?.value ||
    "";
  const product10Molecular =
    additionalProducts.find((field) => field.key === "product10molecular")
      ?.value || "";
  const product10Desc =
    additionalProducts.find((field) => field.key === "product10desc")?.value ||
    "";

  const product11Title =
    additionalProducts.find((field) => field.key === "product11title")?.value ||
    "";
  const product11Empirical =
    additionalProducts.find((field) => field.key === "product11empirical")
      ?.value || "";
  const product11Cas =
    additionalProducts.find((field) => field.key === "product11cas")?.value ||
    "";
  const product11Molecular =
    additionalProducts.find((field) => field.key === "product11molecular")
      ?.value || "";
  const product11Desc =
    additionalProducts.find((field) => field.key === "product11desc")?.value ||
    "";

  return (
    <div
      className="
      scrollContainer w-full               /* always full width            */
      overflow-hidden lg:overflow-visible  /* allow growth on large screens */
      min-h-screen                         /* at least 100 vh everywhere    */
      bg-no-repeat
    "
      ref={svgContainerRef}
    >
      <div
        className="
    w-full
    absolute top-0                       /* keep mobile behaviour         */
    lg:relative lg:static lg:auto        /* un-pin on ≥ lg so it grows    */
  "
      >
        <div className="w-full h-[100dvh] lg:h-screen bg-cover bg-center relative">
          <video
            className="w-full h-[100dvh] xl:h-full object-cover "
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={bannerVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 flex flex-col gap-[27px] lg:gap-10 justify-end text-white font-medium p-5 xl:p-10 bg-black/30">
            <h1 className="w-full lg:w-[650px] text-[32px] leading-10 lg:text-[62px] lg:leading-[70px] font-heading">
              {bannerTitle}
            </h1>
            <p className="w-full lg:w-[650px] font-subHeading text-[14px] leading-[22px] lg:text-[18px] lg:leading-[26px]">
              {bannerDesc}
            </p>
          </div>
        </div>

        <IntermediateProducts
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
          product5Title={product5Title}
          product5Empirical={product5Empirical}
          product5Cas={product5Cas}
          product5Molecular={product5Molecular}
          product5Desc={product5Desc}
          product6Title={product6Title}
          product6Empirical={product6Empirical}
          product6Cas={product6Cas}
          product6Molecular={product6Molecular}
          product6Desc={product6Desc}
          product7Title={product7Title}
          product7Empirical={product7Empirical}
          product7Cas={product7Cas}
          product7Molecular={product7Molecular}
          product7Desc={product7Desc}
          product8Title={product8Title}
          product8Empirical={product8Empirical}
          product8Cas={product8Cas}
          product8Molecular={product8Molecular}
          product8Desc={product8Desc}
          product9Title={product9Title}
          product9Empirical={product9Empirical}
          product9Cas={product9Cas}
          product9Molecular={product9Molecular}
          product9Desc={product9Desc}
          product10Title={product10Title}
          product10Empirical={product10Empirical}
          product10Cas={product10Cas}
          product10Molecular={product10Molecular}
          product10Desc={product10Desc}
          product11Title={product11Title}
          product11Empirical={product11Empirical}
          product11Cas={product11Cas}
          product11Molecular={product11Molecular}
          product11Desc={product11Desc}
          language={language}
        />
        {/* <OurGlobalPresence language={language}/> */}
      </div>
    </div>
  );
};

export default Intermediate;
