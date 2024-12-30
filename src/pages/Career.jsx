import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../pages/Loader";  // Assuming you have a Loader component
import OurGlobalPresence from "@/sections/OurGlobalPresence";

const Career = ({ language, setLoading }) => {
  const [metaFields, setMetaFields] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareer = async () => {
      const query = `query {
        metaobjects(type: "career", first: 50) {
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, targetLanguage: language }),
          }
        );

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
            }
          });

          await Promise.all(imageFetchPromises);
          setMetaFields(fields);
          setLoading(false); // Set loading to false once data is fetched
        }
      } catch (error) {
        console.error("Error fetching homepage meta fields:", error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchCareer();
  }, [language, setLoading]); // Call setLoading in the effect

  if (!metaFields) {
    return <Loader />;
  }

  return (
    <div>
      <div className="w-full h-[700px] lg:h-[880px] bg-cover bg-center bg-white relative">
        <div className="hidden lg:flex inset-x-0 top-20 bg-[#FAF8F8] text-black text-sm items-center space-x-4 px-28 h-8 relative z-10">
          <Link
            to="/"
            className={`hover:text-blue-500 ${location.pathname === "/" ? "font-bold" : ""}`}
          >
            Home
          </Link>
          <span className="text-gray-400"> &gt; </span>
          <Link
            to="/career"
            className={`hover:text-blue-500 ${location.pathname === "/career" ? "font-bold" : ""}`}
          >
            Career
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
                {metaFields.banner_heading}
              </p>
              <button
                className="bg-red text-white text-base font-subHeading h-[42px] w-[192px] rounded-lg"
                onClick={() => navigate("/contact-us")}
              >
                {metaFields.banner_button_text}
              </button>
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
      <OurGlobalPresence language={language} />
    </div>
  );
};

export default Career;
