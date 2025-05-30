import { useEffect, useState } from "react";

const OurGlobalPresence = ({ language }) => {
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

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseText = await response.text();
        const result = JSON.parse(responseText);
        console.log("result", result);

        if (result?.data?.metaobjects) {
          const fields = {};
          for (const edge of result.data.metaobjects.edges) {
            for (const field of edge.node.fields) {
              if (field.reference?.image?.url) {
                fields[field.key] = field.reference.image.url;
              } else {
                fields[field.key] = field.value;
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

  // Mock data for demo purposes
  const mockData = {
    global_presence_title: "Our Workplace",
    country_name_1: "Our Factory",
    country_addr_1: "Soujarya Color Pvt. Ltd.\nC 35/36, TTC Industrial Area,\nMIDC Pawne\nNavi Mumbai - 400 705,\nMaharashtra, India",
    country_name_2: "Corporate Office", 
    country_addr_2: "Soujarya Color Pvt. Ltd.\nC 35/36, TTC Industrial Area,\nMIDC Pawne\nNavi Mumbai - 400 705,\nMaharashtra, India",
    country_name_3: "Upcoming Factory Site",
    country_addr_3: "Plot No.hdbkhasdkhjbd\nSawarkhar, jhdbcjkhsdhjk",
    country_phone_1: "+91 22 6006 1234",
    country_phone_2: "+91 22 6006 1234", 
    country_phone_3: "+91 22 6006 1234",
    global_presence_img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"
  };

  const data = metaFields || mockData;

  if (!data) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full bg-opacity-10 backdrop-blur-lg bg-white relative">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          {/* Title */}
          <div className="mb-8 lg:mb-12">
            <h2 className="font-medium text-lg sm:text-xl lg:text-2xl text-gray-800">
              {data.global_presence_title}
            </h2>
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center">
            {/* Left Section - Content */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Factory */}
                <div className="space-y-6">
                  <div>
                    <h1 className="font-light text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight text-gray-900 mb-4 lg:mb-6 whitespace-pre-line">
                      {data.country_name_1}
                    </h1>
                    <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 leading-relaxed max-w-64">
                      {data.country_addr_1.split('\n').map((line, i) => (
                        <p key={i} className="mb-1">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Corporate Office */}
                <div className="space-y-6">
                  <div>
                    <h1 className="font-light text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight text-gray-900 mb-4 lg:mb-6">
                      {data.country_name_2}
                    </h1>
                    <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 leading-relaxed max-w-64">
                      {data.country_addr_2.split('\n').map((line, i) => (
                        <p key={i} className="mb-1">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Factory */}
                <div className="space-y-6">
                  <div>
                    <h1 className="font-light text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight text-gray-900 mb-4 lg:mb-6">
                      {data.country_name_3}
                    </h1>
                    <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 leading-relaxed max-w-64">
                      {data.country_addr_3.split('\n').map((line, i) => (
                        <p key={i} className="mb-1">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Image */}
            <div className="lg:w-80 xl:w-96 flex items-end">
              <div className="w-full">
                <img
                  src={data.global_presence_img}
                  alt="Factory colorful materials"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Phone Numbers - Bottom */}
          <div className="">
            <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-700">
              T: {data.country_phone_1} / {data.country_phone_2} / {data.country_phone_3}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurGlobalPresence;