import CustomSlider from '../sections/CustomSlider';
import  React, { useEffect, useRef, useState } from "react";
import { productCards, lifeSciencesSlides } from '../lib/contants';
import Cards from '@/components/Cards';
import OurGlobalPresence from '@/sections/OurGlobalPresence';
import { lifeSciImgs, lifeSciImg1, lifeSciImg2 } from '../lib/images';
import '../index.css';
import { descImage1, descImage2, descImage3, descImage4 } from '../lib/images';
import ButtonSlider from '../sections/ButtonSlider';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import Footer from "../components/Footer";

const CoatingsInks = () => {
  // State to manage selected category
  const [activeCategory, setActiveCategory] = useState('Eye Makeup');

  const [metaFields, setMetaFields] = useState(null);
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();

  const [highlights, setHighlights] = useState([]);
  const [categories, setCategories] = useState({});
  const [showAlternateContent, setShowAlternateContent] = useState(false);

  const handleProductListing = (category) => {
    navigate(`/product-listing3?category=${encodeURIComponent(category)}`);
  };



  
  useEffect(() => {
    const fetchCoatings = async () => {
      const cosmeticsQuery = `query {
        metaobjects(type: "coatings_inks", first: 50) {
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
                }
              }
            }
          }
        }
      }`;

      const categoriesQuery = `query {
        metaobjects(type: "coatings_categories", first: 50) {
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
                }
              }
            }
          }
        }
      }`;
    
      try {
        // Fetch cosmetics
        const cosmeticsResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/coatings-inks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: cosmeticsQuery }),
        });

        const cosmeticsResult = await cosmeticsResponse.json();

        // Fetch categories
        const categoriesResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/coatings-inks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: categoriesQuery }),
        });

        const categoriesResult = await categoriesResponse.json();
        // console.log('Categories Response:', categoriesResult);      

        if (cosmeticsResult?.data && categoriesResult?.data) {
          // Process cosmetics
            const fields = {};
            const slidesArray1 = [];
            const highlights = []; 
            const categories = {};

            // Process home care cosmetics
            for (const edge of cosmeticsResult.data.metaobjects.edges) {
              for (const field of edge.node.fields) {
                if (field.key.startsWith('our_offerings_card')) {
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

                // Check for applications
                if (field.key === 'application_header') {
                  fields.applications_title = field.value;
                } else if (field.key === 'application_desc') {
                  fields.applications_desc = field.value;
                }
              }
            }

            // Process home care categories
            for (const edge of categoriesResult.data.metaobjects.edges) {
              const node = edge.node;
              const categoryKey = node.displayName.toLowerCase().replace(/\s+/g, '_'); // Convert displayName to a key format
          
              categories[categoryKey] = {
                  title: node.displayName,
                  title1: '', // New title field
                  description1: '', // Initialize with empty string
                  description2: '',
                  description3: '', 
                  description4: '', 
                  images1: [],
                  images2: [],
                  images3: [], 
                  images4: [],
              };
          
              for (const field of node.fields) {
                if (field.key === 'description_1') {
                  categories[categoryKey].description1 = field.value;
                } else if (field.key === 'description_2') {
                  categories[categoryKey].description2 = field.value;
                } else if (field.key === 'description_3') {
                  categories[categoryKey].description3 = field.value;
                } else if (field.key === 'description_4') {
                  categories[categoryKey].description4 = field.value; 
                } else if (field.key === 'images_1' && field.value) {
                  const parsedImages1 = JSON.parse(field.value);
                  categories[categoryKey].images1 = await Promise.all(parsedImages1.map(gid => fetchImage(gid)));
                } else if (field.key === 'images_2' && field.value) {
                  const parsedImages2 = JSON.parse(field.value);
                  categories[categoryKey].images2 = await Promise.all(parsedImages2.map(gid => fetchImage(gid)));
                } else if (field.key === 'images_3' && field.value) {
                  const parsedImages3 = JSON.parse(field.value);
                  categories[categoryKey].images3 = await Promise.all(parsedImages3.map(gid => fetchImage(gid))); 
                } else if (field.key === 'images_4' && field.value) {
                  const parsedImages4 = JSON.parse(field.value);
                  categories[categoryKey].images4 = await Promise.all(parsedImages4.map(gid => fetchImage(gid))); 
                } else if (field.key === 'title_1') {
                  categories[categoryKey].title1 = field.value; 
                }
              }
            }

            const imageFetchPromises = cosmeticsResult.data.metaobjects.edges.map(async (edge) => {
              for (const field of edge.node.fields) {
                if (field.reference?.image?.url) {
                    fields[field.key] = field.reference.image.url;
                } else if (field.reference?.sources) {
                    fields[field.key] = field.reference.sources[0].url;
                } else {
                    fields[field.key] = field.value;
                }

                // Check for GIDs and handle parsing
                if (field.key === 'who_we_are_imgs') {
                  // console.log("GIDs for who_we_are_imgs:", fields[field.key]);
                  // Parse if it is a string
                  const gids = typeof fields[field.key] === 'string' ? JSON.parse(fields[field.key]) : fields[field.key];
                  if (Array.isArray(gids)) {
                      const imageUrls = await Promise.all(gids.map(gid => fetchImage(gid)));
                      fields[field.key] = imageUrls; // Set the image URLs
                  } else {
                      console.error("who_we_are_imgs is not an array");
                  }
                }
              }
            });

            await Promise.all(imageFetchPromises);
            setMetaFields(fields);
            setSlides(slidesArray1.filter(slide => slide.image && slide.title)); // Set slides state
            setHighlights(highlights.filter(h => h.title && h.desc));
            setCategories(categories);
            setActiveCategory(Object.keys(categories)[0]);
        
            // console.log("Fetched metaFields:", fields); 
            // console.log("Slides Array:", slidesArray1);
            // console.log("highlights:", highlights);
            console.log('Categories:', categories);
            
          } else {
            console.error("Metaobjects not found in the response");
        }

        // console.log('Metaobjects response:', result);
        // console.log('Fetched slides:', slides);

    } catch (error) {
        console.error("Error fetching homepage meta fields:", error);
    }
    };
    
    fetchCoatings();
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
        <div className='w-full bg-cover bg-center relative'>
          <div className='w-full flex h-[820px] lg:h-[800px] relative'>
            <div className='absolute inset-0 flex lg:flex-row flex-col gap-24 lg:justify-between items-center pt-28 lg:pt-10 px-5 lg:px-10'>
              <div className='flex flex-col gap-6 text-black font-medium'>
                <h1 className='w-full lg:text-[62px] text-[40px] lg:leading-[70px] leading-[50px] font-heading'>{metaFields.banner_title}</h1>
                <p className='text-[18px] font-subHeading leading-[26px] lg:w-[500px]'>
                  {metaFields.banner_desc}
                </p>
                <button className='bg-red text-white text-base font-subHeading h-[42px] w-[192px] rounded-lg' onClick={() => handleProductListing('CoatingsInks')}>Explore Products</button>
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
                <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>Who are we</p>
                <h1 className='font-heading text-[28px] lg:text-[54px] leading-10 lg:leading-[70px]'>
                {metaFields.who_we_are_desc}
                </h1>
              </div>

              <div className='w-full flex gap-5 lg:gap-8 justify-between lg:justify-end mb-5 lg:mb-10 px-3 lg:px-0'>
                <div className='w-[110px] sm:w-[170px] md:w-[200px] lg:w-[250px] h-[160px] sm:h-[250px] md:h-[300px] lg:h-[400px] bg-cover bg-center'>
                  <img src={metaFields.who_we_are_imgs[0]} className='w-full h-full'></img>
                </div>
                <div className='w-[245px] sm:w-[370px] md:w-[400px] lg:w-[600px] h-[160px] sm:h-[250px] md:h-[300px] lg:h-[400px] bg-cover bg-center'>
                  <img src={metaFields.who_we_are_imgs[1]} className='w-full h-full'></img>
                </div>
              </div>
            </div>

            {/* Our Current offering */}
            <div className='w-full flex flex-col px-5 lg:px-10'>
              <CustomSlider title='Our Brands' subTitle='Enhance your Aura with our Aura series' slides={slides} />
            </div>

            {/* Our Products highlights */}
            <div className='w-full flex flex-col px-5 lg:px-10'>
              <div className='w-full flex flex-col items-start'>
                <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>Our Product Highlights</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10 lg:pr-20">
                {highlights.map((highlight, index) => (
                  <Cards key={index} title={highlight.title} desc={highlight.desc} />
                ))}
              </div>
            </div>

            {/* Dynamic Content Section */}
            <div className="w-full flex flex-col px-5 lg:px-10 mt-10">
                {/* Top buttons */}
                <div className="hidden lg:flex justify-center flex-wrap gap:4 md:gap-4 lg:gap-4 py-5">
                  {Object.keys(categories).map((category) => (
                    <div key={category} className="flex flex-row items-center gap-5">
                      {/* Button for the main title */}
                      <button
                        onClick={() => {
                          setActiveCategory(category);
                          setShowAlternateContent(false); // Show default content
                        }}
                        className={`px-6 py-2 border rounded-md transition-all duration-300 ease-in-out w-[10rem] lg:w-[20rem] ${activeCategory === category && !showAlternateContent ? 'bg-red text-white shadow-lg' : 'bg-white text-black border border-gray-300 hover:bg-[#d2d3d3]'}`}
                      >
                        {categories[category].title}
                      </button>
                      
                      {/* Button for title1 (alternate content) */}
                      {categories[category].title1 && (
                        <button
                          onClick={() => {
                            setActiveCategory(category);
                            setShowAlternateContent(true); // Show alternate content
                          }}
                          className={`px-6 py-2 border rounded-md transition-all duration-300 ease-in-out w-[10rem] lg:w-[20rem] ${activeCategory === category && showAlternateContent ? 'bg-red text-white shadow-lg' : 'bg-white text-black border border-gray-300 hover:bg-[#d2d3d3]'}`}
                        >
                          {categories[category].title1}
                        </button>
                      )}
                    </div>
                  ))}
                </div>


                {/* Slider for smaller screens */}
                <div className="lg:hidden">
                  <ButtonSlider 
                    categories={categories} 
                    onCategorySelect={setActiveCategory} 
                    activeCategory={activeCategory} 
                    showAlternateContent={showAlternateContent}
                    setShowAlternateContent={setShowAlternateContent}
                  />
                </div>

                {/* Content based on active category */}
                <div className="content-section px-5 lg:px-10">
                  <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left content - Description1 */}
                    <div className="w-full flex lg:flex-row flex-col lg:justify-between items-center lg:w-1/2">
                      <div className='flex flex-col text-black'>
                        <h2 className="w-full font-heading text-2xl lg:text-4xl">Benefits</h2>
                        <p className="text-[#667085] font-subHeading text-[16px] mt-4">
                          {showAlternateContent
                            ? categories[activeCategory]?.description3 || 'No description available for this category.'
                            : categories[activeCategory]?.description1 || 'No description available for this category.'}
                        </p>
                      </div>
                    </div>

                    {/* Right content - Images1 */}
                    <div className="w-full flex gap-6 mt-12">
                      {showAlternateContent
                        ? categories[activeCategory]?.images3 && categories[activeCategory].images3.length > 0 ? (
                          categories[activeCategory].images3.map((img, index) => (
                            <div key={index}>
                              <img src={img} alt={activeCategory} className="object-cover" />
                            </div>
                          ))
                        ) : (
                          <p>No images available for this category.</p>
                        )
                        : categories[activeCategory]?.images1 && categories[activeCategory].images1.length > 0 ? (
                          categories[activeCategory].images1.map((img, index) => (
                            <div key={index}>
                              <img src={img} alt={activeCategory} className="object-cover" />
                            </div>
                          ))
                        ) : (
                          <p>No images available for this category.</p>
                        )}
                    </div>
                  </div>

                  {/* New section for Images2 and Description2 */}
                  <div className="flex flex-col lg:flex-row gap-10 mt-10">
                    {/* Left content - Images2 */}
                    <div className="w-full flex gap-6 mt-12 lg:mt-0 order-2 lg:order-1 mb-10">
                      {showAlternateContent
                        ? categories[activeCategory]?.images4 && categories[activeCategory].images4.length > 0 ? (
                          categories[activeCategory].images4.map((img, index) => (
                            <div key={index}>
                              <img src={img} alt={activeCategory} className="object-cover" />
                            </div>
                          ))
                        ) : (
                          <p>No images available for this category.</p>
                        )
                        : categories[activeCategory]?.images2 && categories[activeCategory].images2.length > 0 ? (
                          categories[activeCategory].images2.map((img, index) => (
                            <div key={index}>
                              <img src={img} alt={activeCategory} className="object-cover" />
                            </div>
                          ))
                        ) : (
                          <p>No images available for this category.</p>
                        )}
                    </div>

                    {/* Right content - Description2 */}
                    <div className="w-full flex lg:flex-row flex-col lg:justify-between items-center lg:w-1/2 order-1 lg:order-2">
                      <div className='flex flex-col text-black'>
                        <h2 className="w-full font-heading text-2xl lg:text-4xl">Use Cases</h2>
                        <p className="text-[#667085] font-subHeading text-[16px] mt-4">
                          {showAlternateContent
                            ? categories[activeCategory]?.description4 || 'No description available for this category.'
                            : categories[activeCategory]?.description2 || 'No description available for this category.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            {/* Our Global presence */}
            <OurGlobalPresence />
          </div>
        </div>

    
  );
};

export default CoatingsInks;
