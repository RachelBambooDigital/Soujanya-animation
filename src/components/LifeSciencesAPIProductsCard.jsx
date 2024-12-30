import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

const LifeSciencesAPIProductsCard = ({ title, description,EmpiricalFormula,CASNumber, MolecularWeight, language}) => {

  const [metaFields, setMetaFields] = useState(null);
  useEffect(() => {
    const fetchGlobalPresence = async () => {
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
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/shopify/lifescience-api`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, targetLanguage: language }),
          }
        );
  
        const result = await response.json();
        console.log("result", result);
  
        if (result?.data?.metaobjects) {
          const fields = {};
          for (const edge of result.data.metaobjects.edges) {
            for (const field of edge.node.fields) {
              fields[field.key] = field.value;
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
    <div className="w-full lg:w-[644px] h-[350px] lg:h-[350px] ">
      {/* Product Title */}
      <h2 className="text-[24px] lg:text-[32px] font-heading mb-4 lg:ml-6">{title}</h2>

      {/* Horizontal Line */}
      <hr className="border-t border-[#727272] mb-4" />

      {/* Product Description */}
      <div className="flex flex-col text-[18px] leading-[26px] font-subHeading lg:ml-6 mb-4">
        <div className="flex">
          <p className="font-semibold w-[160px]">{metaFields.empirical_title}</p>
          <span className="font-normal text-gray-600">{EmpiricalFormula}</span>
        </div>
        <div className="flex">
          <p className="font-semibold w-[160px]">{metaFields.cas_title}</p>
          <span className="font-normal text-gray-600">{CASNumber}</span>
        </div>
        <div className="flex">
          <p className="font-semibold w-[160px]">{metaFields.molecular_title}</p>
          <span className="font-normal text-gray-600">{MolecularWeight}</span>
        </div>
      </div>
      <p className="text-[18px] leading-[26px] font-subHeading text-gray-600 lg:ml-6 w-full lg:w-[400px] text-[#667085]">{description}</p>
    </div>
  );
};

// Define prop types for the component
LifeSciencesAPIProductsCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default LifeSciencesAPIProductsCard;
