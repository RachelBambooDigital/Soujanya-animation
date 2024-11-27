import OurGlobalPresence from "@/sections/OurGlobalPresence";
import OurPurposeAboutUs from '@/sections/OurPurposeAboutUs';
import { drivers1, drivers2 } from '../lib/contants'
import React, { useEffect, useState, useRef } from 'react';
import ScrollableDrivers from '@/sections/ScrollableDrivers';
import { Link } from "react-router-dom";
import '../index.css';
import Footer from "../components/Footer";

const AboutUs = () => {
  const [metaFields, setMetaFields] = useState(null);
  const [scrollableDrivers, setScrollableDrivers] = useState([]);
  const [businessHighlights, setBusinessHighlights] = useState([]);
  const historyRef = useRef(null); // Create a ref

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
          const newDrivers = [];
          const newHighlights = [];

          const imageFetchPromises = result.data.metaobjects.edges.map(async (edge) => {
            for (const field of edge.node.fields) {
              if (field.key === 'highlights_heading') {
                fields[field.key] = field.value; // Extract highlights_heading
              }

              if (field.reference?.image?.url) {
                fields[field.key] = field.reference.image.url;
              } else if (field.reference?.sources) {
                fields[field.key] = field.reference.sources[0].url;
              } else {
                fields[field.key] = field.value;
              }

              // Check for GIDs and handle parsing
              if (field.key === 'who_we_are_imgs_line_1' || field.key === 'who_we_are_imgs_line_2') {
                // console.log("GIDs for about_us:", fields[field.key]);
                const gids = typeof fields[field.key] === 'string' ? JSON.parse(fields[field.key]) : fields[field.key];
                if (Array.isArray(gids)) {
                  const imageUrls = await Promise.all(gids.map(gid => fetchImage(gid)));
                  fields[field.key] = imageUrls;
                } else {
                  console.error("who_we_are_image is not an array");
                }
              }      
            }
          });

          await Promise.all(imageFetchPromises);
          // console.log("Fetched metaFields:", fields);
          setMetaFields(fields);

          result.data.metaobjects.edges.forEach(edge => {
            edge.node.fields.forEach(field => {
              if (field.key.startsWith('card_') && field.key.endsWith('_title')) {
                const index = parseInt(field.key.split('_')[1]) - 1; // Convert to 0-based index
                const descKey = `card_${index + 1}_desc`; // Build the correct desc key

                // console.log(`Processing card index: ${index + 1}, looking for key: ${descKey}`);
                // console.log("Fields object:", fields);
      
                // Check if the description exists in fields
                if (fields[descKey] !== undefined && fields[descKey] !== null) {
                  // console.log(`Found description for ${descKey}: ${fields[descKey]}`);
                  newDrivers[index] = { title: field.value, desc: fields[descKey] };
                } else {
                  // console.error(`Description not found for index ${index + 1}: ${descKey}`);
                  newDrivers[index] = { title: field.value, desc: 'Description not available' }; // Fallback
                }
              }

              if (field.key.startsWith('highlights_title_')) {
                const index = parseInt(field.key.split('_')[2]) - 1;
                const descKey = `highlights_desc_${index + 1}`;
                const colorKey = `highlights_color_${index + 1}`; // Construct the corresponding color key
          
                if (fields[descKey] !== undefined && fields[descKey] !== null) {
                  newHighlights[index] = { 
                    title: field.value, 
                    desc: fields[descKey], 
                    color: fields[colorKey] // Add the color
                  };
                } else {
                  newHighlights[index] = { 
                    title: field.value, 
                    desc: 'Description not available', 
                    color: fields[colorKey] // Add the color
                  };
                }
              }
            });
          });

          setScrollableDrivers(newDrivers.filter(Boolean)); // Filter out any undefined values
          setBusinessHighlights(newHighlights.filter(Boolean));

        } else {
          console.error("Metaobjects not found in the response");
        }
      } catch (error) {
        console.error("Error fetching homepage meta fields:", error);
      }
    };

    fetchAboutUs();
  }, []);

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
    <div className="">
      <div className="w-full bg-cover bg-center bg-white relative" style={{ backgroundImage: `url("/pipe.png")` }}>
        <div className="w-full h-[635px] lg:h-[880px] bg-cover bg-center bg-white relative">
          {/* Breadcrumbs for Large Screens */}
          <div className="hidden lg:flex inset-x-0 top-0 bg-[#FAF8F8] text-black text-sm items-center space-x-4 px-28 h-8">
            <span>Home</span>
            <span className="text-gray-400"> &gt; </span>
            <span>About us</span>
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
                  {metaFields.banner_desc}
                </p>
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
        
        {/* Who are we */}
        <div className='w-full flex flex-col px-5 lg:px-10'>
          <div className='w-[85%] flex flex-col items-start'>
            <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>Who We Are</p>
            <h1 className='font-heading text-[28px] lg:text-[36px] leading-10 lg:leading-[45px]'>{metaFields.who_we_are_desc}</h1>
            <button className='bg-red text-white text-base font-subHeading h-[42px] w-[192px] rounded-lg mt-10 mb-10' 
              onClick={() => {
                if (historyRef.current) {
                  historyRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}>Our History
            </button>
          </div>
        </div>

        <OurPurposeAboutUs />

        {/* Business Highlights */}
        <div className="w-full flex flex-col gap-16 mb-16 px-5 lg:px-10">
          <div className="w-full flex flex-col items-start">
            <p className="py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
              Business Highlights
            </p>
            <h1 className="font-heading text-[28px] lg:text-[54px] leading-[38px] lg:leading-[70px]">
              {metaFields.highlights_heading}
            </h1>
          </div>

          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessHighlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex flex-col text-white p-6 gap-6 rounded-t-[42px] rounded-l-[42px] pt-20"
                  style={{
                    backgroundColor: highlight.color,
                    width: '100%', // Cards take up 100% width for smaller screens
                    maxWidth: '350px', // Max width of cards for large screens
                    minHeight: '450px', // Set a minimum height to prevent card collapse
                    height: 'auto', // Ensure dynamic height adjustment based on content
                  }}
                >
                  <h1 className="text-[24px] sm:text-[32px] lg:text-[42px] lg:leading-[50px] font-heading sm:h-[6.8rem] md:h-[6.2rem] lg:h-[130px]">
                    {highlight.title}
                  </h1>
                  <p className="text-[18px] sm:text-[16px] font-subHeading leading-[20px] sm:leading-[24px] sm:h-[6.8rem] md:h-[6.2rem] lg:h-[130px]">
                    {highlight.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={historyRef}>
          <ScrollableDrivers drivers2={scrollableDrivers} />
        </div>

        {/* Who we are */}
        <div className='w-full flex flex-col px-5 lg:px-10 bg-white'>
          <div className='w-full flex flex-col items-start'>
            <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>Who we are</p>
            <h1 className='font-heading leading-10 text-[28px] lg:text-[54px] lg:leading-[70px]'>{metaFields.who_we_are_title}</h1>
          </div>

          <div className='w-full flex gap-5 lg:gap-8 justify-between lg:justify-end mb-5 lg:mb-10 px-3 lg:px-0 mt-40'>
            {/* Image 1 */}
            <div className='w-full lg:w-[580px] h-auto max-h-[380px]'>
              <img src={metaFields.who_we_are_imgs_line_1[0]} className='w-full h-auto object-contain' alt="Who are we Image 1" />
            </div>
            {/* Image 2 */}
            <div className='w-full lg:w-[260px] h-auto max-h-[380px]'>
              <img src={metaFields.who_we_are_imgs_line_1[1]} className='w-full h-auto object-contain' alt="Who are we Image 2" />
            </div>
            {/* Image 3 */}
            <div className='w-full lg:w-[580px] h-auto max-h-[380px]'>
              <img src={metaFields.who_we_are_imgs_line_1[2]} className='w-full h-auto object-contain' alt="Who are we Image 3" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 mt-10 ">
            {/* Left content - Description */}
            <div className="w-full flex lg:flex-row flex-col lg:justify-start items-center">
              <div className='flex flex-col text-black'>
                <h2 className="w-full font-heading text-2xl lg:text-4xl">{metaFields.who_we_are_heading}</h2>
                <p className="text-[#667085] font-normal text-[16px] mt-4">{metaFields.who_we_are_desc_2}</p>
                <Link to="/careers">
                  <button className='bg-red text-white text-base font-subHeading h-[42px] w-[192px] rounded-lg mt-10 mb-10'>Explore Careers</button>
                </Link>
              </div>
            </div>

            {/* Right content - Images */}
            <div className="w-full flex gap-6 mt-12 mb-14">
              {/* Image 1 */}
              <div className='w-full lg:w-[580px] h-auto max-h-[380px]'>
                <img src={metaFields.who_we_are_imgs_line_2[0]} className='w-full h-auto object-contain' alt="Who are we Image 2" />
              </div>
              {/* Image 2 */}
              <div className='w-full lg:w-[260px] h-auto max-h-[380px]'>
                <img src={metaFields.who_we_are_imgs_line_2[1]} className='w-full h-auto object-contain' alt="Who are we Image 1" />
              </div>
            </div>
          </div>
        </div>



        <OurGlobalPresence />

      </div>
        
    </div>
  )
}

export default AboutUs