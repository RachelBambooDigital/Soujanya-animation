import React, { useEffect, useState } from 'react';
import { aboutUsCards } from '../lib/contants';
import { HiOutlineArrowNarrowRight } from "react-icons/hi"; // Make sure you import the right icon
import { Link } from 'react-router-dom';

const OurPurposeAboutUs = () => {
    const [metaFields, setMetaFields] = useState(null);

    useEffect(() => {
      const fetchAboutUs = async () => {
          const query = `query {
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
      
          try {
              const response = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/aboutUs`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ query }),
              });
      
              const result = await response.json();
      
              if (result && result.data && result.data.metaobjects) {
                  const fields = {};
      
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
                          if (field.key === 'about_us') {
                              console.log("GIDs for about_us:", fields[field.key]);
                              // Parse if it is a string
                              const gids = typeof fields[field.key] === 'string' ? JSON.parse(fields[field.key]) : fields[field.key];
                              if (Array.isArray(gids)) {
                                  const imageUrls = await Promise.all(gids.map(gid => fetchImage(gid)));
                                  fields[field.key] = imageUrls; // Set the image URLs
                              } else {
                                  console.error("about_us is not an array");
                              }
                          }
                      }
                  });
      
                  await Promise.all(imageFetchPromises);
                //   console.log("Fetched metaFields:", fields); 
                  setMetaFields(fields);
              } else {
                  console.error("Metaobjects not found in the response");
              }
          } catch (error) {
              console.error("Error fetching homepage meta fields:", error);
          }
      };
      
      fetchAboutUs();
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
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div className="w-full mb-5 lg:mb-10 ">
            <div className="w-full flex flex-col gap-10 sm:gap-12 lg:gap-16 px-5 lg:px-10">
                {/* Header Section */}
                <div className="w-full flex flex-col items-start">
                    <p className="py-3 sm:py-5 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
                        Our Purpose
                    </p>
                    <h1 className="font-heading sm:text-[40px] text-[28px] lg:text-[56px] leading-8 sm:leading-10 lg:leading-[70px]">{metaFields.our_purpose_desc}</h1>
                </div>

                {/* Cards Section */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-1 mdLgrid-cols-2 lg:grid-cols-3 gap-5">
                        {/* {aboutUsCards.map((card, index) => (
                            <div key={index} className="flex justify-center">
                                <div className="flex flex-col justify-between gap-0 p-3 border border-[#E6E6E6] rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-[370px] bg-opacity-10 backdrop-blur-lg bg-white relative"> 
                                    <img
                                        src={card.img}
                                        className="w-full h-[350px] object-cover rounded-md mb-4 border border-[#E6E6E6]"
                                        alt={card.title}
                                    />
                                    <h1 className="text-[36px] sm:text-[28px] lg:text-[18px] font-medium leading-6 sm:leading-8 lg:leading-[30px]">
                                        {card.title}
                                    </h1>
                                    <p className="text-[14px] sm:text-[16px] lg:text-[15px] leading-5 lg:leading-[26px] mb-4 text-[#667085]">
                                        {card.description}
                                    </p>
                                    <Link to={card.link}>
                                        <button className="w-full flex items-center justify-center gap-2 sm:gap-3 mt-1 rounded-lg border border-black hover:border-opacity-0 py-2 text-[14px] sm:text-[16px] lg:text-[16px] font-normal hover:bg-red hover:text-white transition-all duration-300">
                                            {card.buttonText} <HiOutlineArrowNarrowRight />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))} */}
                        <div className="flex justify-center">
                            <div className="flex flex-col justify-between gap-0 p-3 border border-[#E6E6E6] rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-[370px] bg-opacity-10 backdrop-blur-lg bg-white relative"> {/* Set border color */}
                                <img
                                    src={metaFields.our_purpose_card_1_img}
                                    className="w-full h-[350px] object-cover rounded-md mb-4 border border-[#E6E6E6]" // Ensure the image fills the card
                                    alt="card1"
                                />
                                <h1 className="text-[16px] sm:text-[16px] lg:text-[18px] font-medium leading-6 sm:leading-8 lg:leading-[30px]">
                                    {metaFields.our_purpose_card_1_title}
                                </h1>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="flex flex-col justify-between gap-0 p-3 border border-[#E6E6E6] rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-[370px] bg-opacity-10 backdrop-blur-lg bg-white relative"> {/* Set border color */}
                                <img
                                    src={metaFields.our_purpose_card_2_img}
                                    className="w-full h-[350px] object-cover rounded-md mb-4 border border-[#E6E6E6]" // Ensure the image fills the card
                                    alt="card1"
                                />
                                <h1 className="text-[16px] sm:text-[16px] lg:text-[18px] font-medium leading-6 sm:leading-8 lg:leading-[30px]">
                                    {metaFields.our_purpose_card_2_title}
                                </h1>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="flex flex-col justify-between gap-0 p-3 border border-[#E6E6E6] rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-[370px] bg-opacity-10 backdrop-blur-lg bg-white relative"> {/* Set border color */}
                                <img
                                    src={metaFields.our_purpose_card_3_img}
                                    className="w-full h-[350px] object-cover rounded-md mb-4 border border-[#E6E6E6]" // Ensure the image fills the card
                                    alt="card1"
                                />
                                <h1 className="text-[16px] sm:text-[16px] lg:text-[18px] font-medium leading-6 sm:leading-8 lg:leading-[30px]">
                                    {metaFields.our_purpose_card_3_title}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurPurposeAboutUs;
