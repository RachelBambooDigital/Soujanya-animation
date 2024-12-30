import { globalPresence } from "@/lib/images";
import { useEffect, useRef, useState } from "react";

const OurGlobalPresence = ({language}) => {
  const [metaFields, setMetaFields] = useState(null);
  useEffect(() => {
    const fetchGlobalPresence = async () => {
      const query = `query {
        metaobjects(type: "our_global_presence", first: 50) {
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

        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Log the response text to inspect what it contains
        const responseText = await response.text();
        // console.log("Response text:", responseText);

        // Try parsing the response as JSON
        const result = JSON.parse(responseText);
        console.log("Parsed result:", result);

        if (result?.data?.metaobjects) {
          const fields = {};
          for (const edge of result.data.metaobjects.edges) {
            for (const field of edge.node.fields) {
              if (field.reference?.image?.url) {
                fields[field.key] = field.reference.image.url;  // Correctly set the image URL
              } else {
                fields[field.key] = field.value;
              }

              // Handle GID for the global_presence_img field
              if (field.key === "global_presence_img") {
                // console.log("GIDs for global_presence_img:", fields[field.key]);
              }
            }
          }

          setMetaFields(fields);
        } else {
          console.error("Metaobjects not found in the response");
        }
      } catch (error) {
        console.error("Error fetching homepage meta fields:", error);
      }
    };

    fetchGlobalPresence();
  }, [language]);

  if (!metaFields) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="w-full h-min">
      <div className="w-full left-0 bg-opacity-10 backdrop-blur-lg bg-white relative h-full">
        <div className="w-full flex flex-col lg:flex-row justify-between h-full px-5 sm:px-8 md:px-10">
          <div className="flex flex-col justify-between gap-10 md:gap-16 lg:gap-0 w-full lg:w-2/3">
            {/* Global Presence Header */}
            <div className="w-full flex flex-col items-start">
              <p className="py-3 sm:py-5 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
                {metaFields.global_presence_title}
              </p>
              <h1 className="font-heading text-[28px] lg:text-[54px] leading-8 sm:leading-10 md:leading-[60px] lg:leading-[70px]">
                {metaFields.global_presence_heading}
              </h1>
            </div>

            {/* Locations Grid */}
            <div className="w-full flex flex-col lg:flex-row justify-between mb-5 lg:mb-10">
              <div className="locations grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-2 lg:gap-16">
                {/* <div className="location w-full flex lg:flex-row lg:justify-start"> */}
                {/* India */}
                <div className="address flex flex-col gap-2 lg:gap-4">
                  <h1 className="font-subHeading font-light text-[24px] sm:text-[28px] md:text-[32px] lg:text-[52px]">
                    {metaFields.country_name_1}
                  </h1>
                  <div className="font-subHeading text-[12px] sm:text-[14px] md:text-[16px] lg:text-base lg:leading-6 font-medium">
                    <div className="h-auto sm:h-[170px] lg:h-[180px]">
                      <p> {metaFields.country_addr_1} </p>
                      {/* <p>Soujanya Color Pvt. Ltd. <br/> C-35/36, TTC Industrial Area, <br/> MIDC Pawne, <br/> Navi Mumbai - 400 705, <br/> Maharashtra, India</p> */}
                      {/* <p>C-35/36, TTC Industrial Area,</p> */}
                      {/* <p>MIDC Pawne,</p> */}
                      {/* <p>Navi Mumbai - 400 705,</p> */}
                      {/* <p>Maharashtra, India</p> */}
                    </div>
                    <div>
                      <p> {metaFields.country_phone_1} </p>
                      {/* <p>T: +91 22 6906 1234 <br/> T: +91 22 6906 1246 </p> */}
                      {/* <p>T: +91 22 6906 1246</p> */}
                    </div>
                  </div>
                </div>

                {/* Brazil */}
                <div className="address flex flex-col gap-2 lg:gap-4">
                  <h1 className="font-subHeading font-light text-[24px] sm:text-[28px] md:text-[32px] lg:text-[52px]">
                    {metaFields.country_name_2}
                  </h1>
                  <div className="font-subHeading text-[12px] sm:text-[14px] md:text-[16px] lg:text-base lg:leading-6 font-medium">
                    <div className="h-auto sm:h-[120px] lg:h-[140px]">
                      <p>{metaFields.country_addr_2}</p>
                      {/* <p>Soujanya Color Pvt. Ltd. <br/> Sao Paulo, Sao Paulo, <br/> Brazil </p> */}
                      {/* <p>Sao Paulo, Sao Paulo,</p> */}
                      {/* <p>Brazil</p> */}
                    </div>
                    <div>
                    <p> {metaFields.country_phone_2} </p>
                      {/* <p>T: +55119 7288 1852</p> */}
                    </div>
                  </div>
                </div>

                {/* Mexico */}
                <div className="address flex flex-col gap-2 lg:gap-4">
                  <h1 className="font-subHeading font-light text-[24px] sm:text-[28px] md:text-[32px] lg:text-[52px]">
                    {metaFields.country_name_3}
                  </h1>
                  <div className="font-subHeading text-[12px] sm:text-[14px] md:text-[16px] lg:text-base lg:leading-6 font-medium">
                    <div className="h-auto sm:h-[120px] lg:h-[140px]">
                      <p>{metaFields.country_addr_3}</p>
                      {/* <p>Soujanya Color Mexico S.A. de C.V. <br/> Insurgentes Sur 1787 Col. <br/> Guadalupe Inn. Alvaro <br/> Obregon. Mexico City</p> */}
                      {/* <p>Insurgentes Sur 1787 Col.</p> */}
                      {/* <p>Guadalupe Inn. Alvaro</p> */}
                      {/* <p>Obregon. Mexico City</p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex lg:items-end pb-10 lg:w-1/3">
            <img
              src={metaFields.global_presence_img}
              alt="section-img"
              className="w-full lg:w-[412px] h-[500px] lg:h-[572px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurGlobalPresence;
