import React, { useState, useEffect, useRef } from 'react';

const 
ScrollableDrivers = ({ drivers2, language }) => {
    const [metaFields, setMetaFields] = useState(null);

    const scrollContainerRef = useRef(null);
    const scrollAmount = 320; // Amount to scroll each time

    // Create a new array with duplicated items for seamless scrolling
    const extendedDrivers = [...drivers2, ...drivers2]; // Duplicate entire array

    // Automatically scroll the container
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        if (scrollContainer) {
            const hasEnoughContent = scrollContainer.scrollWidth > scrollContainer.clientWidth;

            if (hasEnoughContent) {
                const scrollInterval = setInterval(() => {
                    // Scroll by the specified amount
                    scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });

                    // Check if we've reached the end of the first set of items
                    if (scrollContainer.scrollLeft >= drivers2.length * 400) {
                        // Reset to start of first set
                        setTimeout(() => {
                            scrollContainer.scrollLeft = 0; // Reset to beginning
                        }, 500); // Delay for smooth transition
                    }
                }, 4000); // Scroll every 2 seconds

                return () => clearInterval(scrollInterval);
            }
        }
    }, [drivers2]);

    // Handle touch events for mobile scrolling
    const handleTouchStart = (e) => {
        const touchStartX = e.touches[0].clientX;
        scrollContainerRef.current.dataset.touchStartX = touchStartX;
    };

    const handleTouchMove = (e) => {
        const touchStartX = parseInt(scrollContainerRef.current.dataset.touchStartX);
        const touchMoveX = e.touches[0].clientX;
        const touchDiff = touchStartX - touchMoveX;

        scrollContainerRef.current.scrollLeft += touchDiff;
    };

    useEffect(() => {
      const fetchAboutUs2 = async () => {
        const query = `query {
          metaobjects(type: "about_us_2", first: 50) {
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
    
      fetchAboutUs2();
    }, [language]); 
    
    if (!metaFields) {
      return <div>Loading...</div>; // Loading state
    }

    return (
        <div className='w-full flex flex-col gap-16 mb-16 px-5 lg:px-10'>
            <div className='w-full flex flex-col items-start'>
                <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>
                  {metaFields.our_story_title}
                </p>
                <h1 className='font-heading text-[28px] lg:text-[54px] leading-[38px] lg:leading-[70px]'>
                  {metaFields.our_story_desc}
                </h1>
            </div>

            <div className='w-full flex justify-center overflow-hidden'>
                <div
                ref={scrollContainerRef}
                className='flex gap-4 no-scrollbar'
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                style={{ overflowX: 'hidden', whiteSpace: 'nowrap' }} // Ensure horizontal scrolling
                >
                {extendedDrivers.map((driver, index) => (
                    <div
                    key={index}
                    className={`flex-shrink-0 w-full sm:w-[300px] lg:w-[350px] min-h-[450px] bg-opacity-45 backdrop-blur-lg flex flex-col items-start justify-start text-black p-4 gap-4 ${driver.color} rounded-t-[42px] rounded-l-[42px]`}
                    style={{ backgroundColor: 'rgba(44, 41, 130, 0.08)' }}
                    >
                    <div className="flex flex-col justify-start h-[70px] mt-28"> {/* Ensure consistent title height */}
                        <h1 className='text-[45px] font-heading text-left'>{driver.title}</h1>
                    </div>
                    <p className='text-[16px] font-subHeading leading-[24px] whitespace-normal text-left overflow-hidden'>
                        {driver.desc}
                    </p>
                    </div>
                ))}
                </div>
            </div>
        </div>


    );
};

export default ScrollableDrivers;
