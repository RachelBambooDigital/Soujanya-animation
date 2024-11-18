import React from 'react';
import { useEffect, useState } from 'react';
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow component
const CustomArrow = ({ className, style, onClick, icon }) => {
    return (
        <button
            className={`${className} bg-transparent border border-gray-400 py-1 px-3 rounded-sm hover:bg-gray-100`}
            style={{ ...style }}
            onClick={onClick}
        >
            {icon}
        </button>
    );
};

const OurProducts = () => {
    const sliderRef = React.useRef(null);

    const nextSlide = () => {
        sliderRef.current.slickNext();
    };

    const prevSlide = () => {
        sliderRef.current.slickPrev();
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        swipe: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const [metaFields, setMetaFields] = useState(null);
    useEffect(() => {
        const fetchHomePageMeta = async () => {
            const query = `query {
                metaobjects(type: "homepage", first: 50) {
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
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/homepage-meta`, {
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
                            if (field.key === 'our_products_image' || field.key === 'product_2_images') {
                                console.log("GIDs for our_products_image:", fields[field.key]);
                                // Parse if it is a string
                                const gids = typeof fields[field.key] === 'string' ? JSON.parse(fields[field.key]) : fields[field.key];
                                if (Array.isArray(gids)) {
                                    const imageUrls = await Promise.all(gids.map(gid => fetchImage(gid)));
                                    fields[field.key] = imageUrls; // Set the image URLs
                                } else {
                                    console.error("our_products_image is not an array");
                                }
                            }
                        }
                    });
        
                    await Promise.all(imageFetchPromises);
                    console.log("Fetched metaFields:", fields); // Log to check the structure
                    setMetaFields(fields);
                } else {
                    console.error("Metaobjects not found in the response");
                }
            } catch (error) {
                console.error("Error fetching homepage meta fields:", error);
            }
        };
        
        fetchHomePageMeta();
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

    // console.log("Product 2 Image Titles:", metaFields.product_2_image_title);
    return (
        <div className='w-full mb-5 lg:mb-10'>
            <div className='w-full flex flex-col gap-16 px-5 lg:px-10'>
                <div className='w-full flex flex-col items-start'>
                    <p className='py-5 lg:py-10 font-subHeading font-medium text-[14px] lg:text-[18px]'>Our Products</p>
                    <h1 className='font-heading text-[32px] leading-10 lg:text-[62px] lg:leading-[70px]'>{metaFields.our_products_title}</h1>
                </div>

                <div className='w-full gap-96'>
                    <Slider ref={sliderRef} {...settings}>
                        {/* Card 1 */}
                        <div className='p-1 lg:p-3'>
                            <div className="w-full flex flex-col bg-gradient-to-tr from-blue to-green gap-6 lg:gap-10 p-5 lg:p-8 text-white font-subHeading rounded-2xl">
                                <div className='flex flex-col lg:gap-4'>
                                    <h1 className='w-[250px] lg:w-[350px] h-[130px] lg:h-[100px] font-heading text-[32px] leading-[40px] lg:text-[42px] lg:leading-[50px]'>{metaFields.our_products_card_1_title}</h1>
                                    <p className='w-full lg:w-[350px] h-[130px] lg:h-[70px] text-[14px] leading-5 lg:text-[18px] lg:leading-[26px]'>{metaFields.our_products_card_1_desc}</p>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex gap-6 items-center'>
                                        <img src={metaFields.our_products_card_1_img_1} className='w-16 h-16' alt="Product 1" />
                                        <h1>{metaFields.our_products_card_1_img_1_title}</h1>
                                    </div>
                                    <div className='flex gap-6 items-center'>
                                        <img src={metaFields.our_products_card_1_img_2} className='w-16 h-16' alt="Product 2" />
                                        <h1>{metaFields.our_products_card_1_img_2_title}</h1>
                                    </div>
                                    <div className='flex gap-6 items-center'>
                                        <img src={metaFields.our_products_card_1_img_3} className='w-16 h-16' alt="Product 5" />
                                        <h1>{metaFields.our_products_card_1_img_3_title}</h1>
                                    </div>
                                </div>
                                <Link to="/product-listing3?category=CoatingsInks"><button className='w-full flex items-center justify-center gap-3 rounded-lg border border-white py-2 font-subHeading text-[16px] text-white font-light  hover:bg-white hover:text-black transition-all duration-300'>See More <HiOutlineArrowNarrowRight /></button></Link>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className='p-1 lg:p-3'>
                            <div className="w-full flex flex-col bg-gradient-to-tl from-lightOrange to-darkOrange gap-6 lg:gap-10 p-5 lg:p-8 text-white font-subHeading rounded-2xl">
                                <div className='flex flex-col lg:gap-4'>
                                    <h1 className='w-[250px] lg:w-[350px] h-[130px] lg:h-[100px] font-heading text-[32px] leading-[40px] lg:text-[42px] lg:leading-[50px]'>{metaFields.our_products_cards_2_title}</h1>
                                    <p className='w-full lg:w-[350px] h-[130px] lg:h-[70px] text-[14px] leading-5 lg:text-[18px] lg:leading-[26px]'>{metaFields.our_products_cards_2_desc}</p>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex gap-6 items-center'>
                                        <img src={metaFields.our_products_card_2_img_1} className='w-16 h-16' alt="Product 3" />
                                        <h1>{metaFields.our_products_card_2_img_1_title}</h1>
                                    </div>
                                    <div className='flex gap-6 items-center'>
                                        <img src={metaFields.our_products_card_2_img_2} className='w-16 h-16' alt="Product 4" />
                                        <h1>{metaFields.our_products_card_2_img_2_title}</h1>
                                    </div>
                                    <div className='flex gap-6 items-center'>
                                        <img src={metaFields.our_products_card_2_img_3} className='w-16 h-16' alt="Product 5" />
                                        <h1>{metaFields.our_products_card_2_img_3_title}</h1>
                                    </div>
                                </div>
                                <Link to="/product-listing?category=HomeCareCosmetics"><button className='w-full flex items-center justify-center gap-3 rounded-lg border border-white py-2 font-subHeading text-[16px] text-white font-light  hover:bg-white hover:text-black transition-all duration-300'>See More <HiOutlineArrowNarrowRight /></button></Link>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className='p-1 lg:p-3'>
                            <div className="w-full flex flex-col bg-gradient-to-bl from-violet to-purple gap-6 lg:gap-10 p-5 lg:p-8 text-white font-subHeading rounded-2xl">
                                <div className='flex flex-col lg:gap-4'>
                                    <h1 className='w-[250px] lg:w-[350px] h-[130px] lg:h-[100px] font-heading text-[32px] leading-[40px] lg:text-[42px] lg:leading-[50px]'>{metaFields.our_products_cards_3_title}</h1>
                                    <p className='w-full lg:w-[350px] h-[130px] lg:h-[70px] text-[14px] leading-5 lg:text-[18px] lg:leading-[26px]'>{metaFields.our_products_cards_3_desc}</p>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex gap-6 items-center'>
                                        <img src={metaFields.our_products_card_3_img_1} className='w-16 h-16' alt="Product 5" />
                                        <h1>{metaFields.our_products_card_3_img_1_title}</h1>
                                    </div>
                                    <div className='flex gap-6 items-center'>
                                        <img src={metaFields.our_products_card_3_img_2} className='w-16 h-16' alt="Product 6" />
                                        <h1>{metaFields.our_products_card_3_img_2_title}</h1>
                                    </div>
                                    <div className='flex gap-6 items-center'>
                                        <img src={metaFields.our_products_card_3_img_3} className='w-16 h-16' alt="Product 5" />
                                        <h1>{metaFields.our_products_card_3_img_3_title}</h1>
                                    </div>
                                </div>
                                <Link to="/product-listing2?category=LifeSciences"><button className='w-full flex items-center justify-center gap-3 rounded-lg border border-white py-2 font-subHeading text-[16px] text-white font-light hover:bg-white hover:text-black transition-all duration-300'>See More <HiOutlineArrowNarrowRight /></button></Link>
                            </div>
                        </div>
                    </Slider>

                    {/* Custom Arrows */}
                    <div className="flex justify-between px-2 mt-6 lg:hidden mb-5">
                        <CustomArrow icon={<HiOutlineArrowNarrowLeft />} onClick={prevSlide} />
                        <CustomArrow icon={<HiOutlineArrowNarrowRight />} onClick={nextSlide} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurProducts;
