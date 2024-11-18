import CustomSlider1 from '../sections/CustomSlider'
import React, { useEffect, useState } from 'react'
import { productCards, lifeSciencesSlides } from '../lib/contants'
import { drivers } from '../lib/contants'
import Cards from '@/components/Cards'
import OurGlobalPresence from '@/sections/OurGlobalPresence'
import { lifeSciImgs, lifeSciImg1, lifeSciImg2 } from '../lib/images'
import '../index.css';
import { useNavigate } from 'react-router-dom';

const LifeSciences = () => {
  const [metaFields, setMetaFields] = useState(null);
  const [slides, setSlides] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const navigate = useNavigate();

  const handleProductListing = (category) => {
    navigate(`/product-listing2?category=${encodeURIComponent(category)}`);
  };

  useEffect(() => {
    const fetchLifesciences = async () => {
        const query = `query {
            metaobjects(type: "lifesciences", first: 50) {
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
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/lifesciences`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });
    
            const result = await response.json();
    
            if (result && result.data && result.data.metaobjects) {
                const fields = {};
                const slidesArray1 = [];

                for (const edge of result.data.metaobjects.edges) {
                  for (const field of edge.node.fields) {
                      if (field.key.startsWith('our_categories_card')) {
                          const cardIndex = parseInt(field.key.split('_').pop(), 10) - 1;

                          if (!slidesArray1[cardIndex]) {
                              slidesArray1[cardIndex] = { id: cardIndex + 1 };
                          }

                          if (field.key.includes('title')) {
                              slidesArray1[cardIndex].title = field.value;
                          } else if (field.key.includes('image') && field.reference?.image?.url) {
                              slidesArray1[cardIndex].image = field.reference.image.url;
                          } else if (field.key.includes('link')) {
                              slidesArray1[cardIndex].link = field.value;
                          }
                      } 

                      // Check for highlights
                      if (field.key.startsWith('highlight')) {
                        const index = field.key.match(/\d+/)[0]; // Extract number from key
                        highlights[index - 1] = highlights[index - 1] || {}; // Ensure array entry exists
                        if (field.key.includes('title')) {
                          highlights[index - 1].title = field.value;
                        } else if (field.key.includes('desc')) {
                          highlights[index - 1].desc = field.value;
                        }
                      } else {
                        fields[field.key] = field.value;
                      }
                  }
                }
    
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
                        if (field.key === 'lifesciences') {
                            console.log("GIDs for lifesciences:", fields[field.key]);
                            // Parse if it is a string
                            const gids = typeof fields[field.key] === 'string' ? JSON.parse(fields[field.key]) : fields[field.key];
                            if (Array.isArray(gids)) {
                                const imageUrls = await Promise.all(gids.map(gid => fetchImage(gid)));
                                fields[field.key] = imageUrls; // Set the image URLs
                            } else {
                                console.error("lifesciences is not an array");
                            }
                        }
                    }
                });
    
                await Promise.all(imageFetchPromises);
                console.log("Fetched metaFields:", fields); // Log to check the structure
                setMetaFields(fields);
                setSlides(slidesArray1.filter(slide => slide.image && slide.title)); // Set slides state
                setHighlights(highlights.filter(h => h.title && h.desc));

            } else {
                console.error("Metaobjects not found in the response");
            }
        } catch (error) {
            console.error("Error fetching homepage meta fields:", error);
        }
    };
    
    fetchLifesciences();
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
    <div className='w-full bg-cover bg-center bg-white relative' style={{ backgroundImage: `url("/pipe.png")` }}>
      <div className='w-full flex h-[820px] lg:h-[800px] relative bg-white ' >
        <div className='absolute inset-0 flex lg:flex-row flex-col gap-24 lg:justify-between items-center pt-28 lg:pt-10 px-5 lg:px-10 '>
          <div className=' flex flex-col gap-6 text-black font-medium '>
            <h1 className='w-full lg:text-[62px] text-[40px] lg:leading-[70px] leading-[50px] font-heading'>{metaFields.banner_title}</h1>
            <p className='text-[18px] font-subHeading leading-[26px] lg:w-[500px]'>{metaFields.banner_desc}</p>
            <button className='bg-red text-white text-base font-subHeading h-[42px] w-[192px] rounded-lg' onClick={() => handleProductListing('LifeSciences')}>Explore Products</button>
          </div>
          <div className='w-full lg:w-[60%] h-[300px] lg:h-[600px] bg-cover bg-center'>
            <img src={metaFields.banner_img} className='w-full h-full'></img>
          </div>
        </div>
      </div>

      <div className='w-full'>

        {/* Who are we */}
        <div className='w-full flex flex-col px-5 lg:px-10 gap-20'>
          <div className='w-full flex flex-col items-start'>
            <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>Who we are</p>
            <h1 className='font-heading text-[28px] lg:text-[54px] leading-10 lg:leading-[70px]'>{metaFields.who_we_are_desc}</h1>
          </div>

          <div className='w-full flex gap-5 lg:gap-8 justify-between lg:justify-end mb-5 lg:mb-10 px-3 lg:px-0'>
            {/* <div className='w-[217px] h-[376px] bg-cover bg-center' style={{ backgroundImage: `url("${heroSecImg1}")` }}></div> */}
            <div className='w-[110px] lg:w-[250px] h-[160px] lg:h-[400px] bg-cover bg-center'>
              <img src={metaFields.who_we_are_img_1} className='w-full h-full'></img>
            </div>
            {/* <div className='w-[714px] h-[476px] bg-cover bg-center' style={{ backgroundImage: `url("${heroSecImg2}")` }}></div> */}
            <div className='w-[245px] lg:w-[600px] h-[160px] lg:h-[400px] bg-cover bg-center'>
              <img src={metaFields.who_we_are_img_2} className='w-full h-full'></img>
            </div>
          </div>
        </div>

        {/* Our Drivers */}
        <div className='w-full flex flex-col gap-20 mb-16 px-5 lg:px-10'>
          <div className='w-full flex flex-col items-start'>
            <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>Our Drivers</p>
            <h1 className='font-heading text-[28px] lg:text-[54px] leading-[38px] lg:leading-[70px]'>We are dedicated to precision</h1>
          </div>

          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:px-20 gap-[16px] h-800px lg:h-[400px] '>
            {
              drivers.map((driver, index) => (
                <div key={index} className={`w-full h-[450px] flex flex-col justify-center text-white p-4 gap-4 ${driver.color} rounded-t-[42px] rounded-l-[42px]`}>
                  <h1 className='text-[32px] font-heading'>{driver.title}</h1>
                  <p className='text-[16px] font-subHeading leading-[24px]'>{driver.desc}</p>
                </div>
              ))
            }
          </div>
        </div>

        {/* Our Current offering */}
        <div className='w-full flex flex-col px-5 lg:px-10'>
          <CustomSlider1 title='Our Current Offerings' subTitle='We are passionate about what we do' slides={slides} />
        </div>

        {/* Our business highlights */}
        <div className='w-full flex flex-col bg-white px-5 lg:px-10'>
          <div className='w-full flex flex-col items-start'>
            <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>Lifesciences Highlights</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10 lg:pr-20">
            {highlights.map((highlight, index) => (
              <Cards key={index} title={highlight.title} desc={highlight.desc} />
            ))}
          </div>
        </div>

        {/* Our Global presence */}
        <OurGlobalPresence />
      </div>

    </div>
  )
}

export default LifeSciences