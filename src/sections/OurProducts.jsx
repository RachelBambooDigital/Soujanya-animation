import React from "react";
import { useEffect, useState } from "react";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import Slider from "react-slick";
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

const OurProducts = ({ language }) => {
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
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: true,
    centerMode: false,
    variableWidth: false,
  };

  const [metaFields, setMetaFields] = useState(null);
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const fetchHomePageMeta = async () => {
      const homepage1 = `query {
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

      const homepage2 = `query {
                metaobjects(type: "homepage_2", first: 50) {
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
        const homepageResponse1 = await fetch(
          `${import.meta.env.VITE_BASE_URL}/shopify/homepage-meta`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: homepage1,
              targetLanguage: language,
            }),
          }
        );

        const homepageResult1 = await homepageResponse1.json();

        const homepageResponse2 = await fetch(
          `${import.meta.env.VITE_BASE_URL}/shopify/homepage-meta`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: homepage2,
              targetLanguage: language,
            }),
          }
        );

        const homepageResult2 = await homepageResponse2.json();
        // console.log("result2", homepageResult2);

        if (homepageResult1?.data && homepageResult2?.data) {
          const fields = {};

          for (const edge of homepageResult2.data.metaobjects.edges) {
            for (const field of edge.node.fields) {
              // Check for highlights
              if (field.key.startsWith("highlight")) {
                const index = field.key.match(/\d+/)[0]; // Extract number from key
                highlights[index - 1] = highlights[index - 1] || {}; // Ensure array entry exists
                if (field.key.includes("title")) {
                  highlights[index - 1].title = field.value;
                } else if (field.key.includes("desc")) {
                  highlights[index - 1].desc = field.value;
                }
              } else {
                fields[field.key] = field.value;
              }
            }
          }

          const imageFetchPromises = homepageResult1.data.metaobjects.edges.map(
            async (edge) => {
              for (const field of edge.node.fields) {
                if (field.reference?.image?.url) {
                  fields[field.key] = field.reference.image.url;
                } else if (field.reference?.sources) {
                  fields[field.key] = field.reference.sources[0].url;
                } else {
                  fields[field.key] = field.value;
                }

                // console.log(`Updated fields:`, fields);

                // Check for GIDs and handle parsing
                if (
                  field.key === "our_products_image" ||
                  field.key === "product_2_images"
                ) {
                  console.log(
                    "GIDs for our_products_image:",
                    fields[field.key]
                  );
                  // Parse if it is a string
                  const gids =
                    typeof fields[field.key] === "string"
                      ? JSON.parse(fields[field.key])
                      : fields[field.key];
                  if (Array.isArray(gids)) {
                    const imageUrls = await Promise.all(
                      gids.map((gid) => fetchImage(gid))
                    );
                    fields[field.key] = imageUrls; // Set the image URLs
                  } else {
                    console.error("our_products_image is not an array");
                  }
                }
              }
            }
          );

          await Promise.all(imageFetchPromises);
          // console.log("Fetched metaFields:", fields); // Log to check the structure
          setMetaFields(fields);
        } else {
          console.error("Metaobjects not found in the response");
        }
      } catch (error) {
        console.error("Error fetching homepage meta fields:", error);
      }
    };

    fetchHomePageMeta();
  }, [language]);

  // Function to fetch image URL
  const fetchImage = async (gid) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/shopify/media/${encodeURIComponent(
          gid
        )}`
      );
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

  // Product cards data for easier management
  const cardData = [
    {
      title: metaFields.our_products_card_1_title,
      desc: metaFields.our_products_card_1_desc,
      title1: metaFields.our_products_card_1_title_1,
      desc1: metaFields.our_products_card_1_desc_1,
      gradient: "bg-gradient-to-tr from-blue to-green",
      link: "/product-listing3?category=CoatingsInks",
    },
    {
      title: metaFields.our_products_cards_2_title,
      desc: metaFields.our_products_cards_2_desc,
      title1: metaFields.our_products_card_2_title_1,
      desc1: metaFields.our_products_card_2_desc_1,
      gradient: "bg-gradient-to-tl from-lightOrange to-darkOrange",
      link: "/product-listing?category=HomeCareCosmetics",
    },
    {
      title: metaFields.our_products_cards_3_title,
      desc: metaFields.our_products_cards_3_desc,
      title1: metaFields.our_products_card_3_title_1,
      desc1: metaFields.our_products_card_3_desc_1,
      gradient: "bg-gradient-to-bl from-violet to-purple",
      link: "/product-listing2?category=LifeSciences",
    },
  ];

  // Card component to avoid repetition
  const ProductCard = ({ card, isDesktop = false }) => (
    <div className={`w-full ${isDesktop ? "p-2 xl:p-3" : "px-2"}`}>
      <div
        className={`w-full flex flex-col ${card.gradient} gap-4 sm:gap-6 p-4 sm:p-6 text-white font-subHeading rounded-2xl h-full`}
      >
        <div className="flex flex-col gap-3 sm:gap-4 flex-grow">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-[36px] 2xl:text-[38px] font-heading break-words leading-tight whitespace-pre-line">
            {card.title}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-subHeading leading-relaxed break-words">
            {card.desc}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 flex-grow">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-[36px] 2xl:text-[38px] font-heading break-words leading-tight whitespace-pre-line">
            {card.title1}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-subHeading leading-relaxed break-words">
            {card.desc1}
          </p>
        </div>

        <Link to={card.link} className="mt-auto">
          <button className="w-full flex items-center justify-center gap-3 rounded-lg border border-white py-2 px-4 font-subHeading text-sm sm:text-[16px] text-white font-light hover:bg-white hover:text-black transition-all duration-300">
            Explore Products <HiOutlineArrowNarrowRight />
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="w-full mb-5 lg:mb-10">
      <div className="w-full flex flex-col gap-8 sm:gap-12 lg:gap-16 px-4 sm:px-5 lg:px-10">
        <div className="w-full flex flex-col items-start">
          <p className="py-3 sm:py-5 lg:py-10 font-subHeading font-medium text-sm sm:text-[14px] lg:text-[18px]">
            {metaFields.our_products_main_title}
          </p>
          <h1 className="font-heading text-2xl sm:text-[32px] leading-8 sm:leading-10 lg:text-[62px] lg:leading-[70px]">
            {metaFields.our_products_title}
          </h1>
        </div>

        <div className="w-full">
          {/* Desktop Grid Layout - 3 cards in a row */}
          <div
            className="hidden xl:block"
            // style={{ border: "2px solid black" }}
          >
            <div className="grid grid-cols-3 gap-6">
              {cardData.map((card, index) => (
                <div key={index}>
                  <div
                    className={`${card.gradient} h-full p-6 rounded-2xl text-white font-subHeading`}
                    style={{ minHeight: "600px" }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex flex-col gap-4 mb-10 flex-grow">
                        <h1 className="text-3xl xl:text-[36px] 2xl:text-[38px] font-heading break-words leading-tight whitespace-pre-line">
                          {card.title}
                        </h1>
                        <p className="text-lg xl:text-xl font-subHeading leading-relaxed break-words">
                          {card.desc}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 mb-24 flex-grow">
                        <h1 className="text-3xl xl:text-[36px] 2xl:text-[38px] font-heading break-words leading-tight whitespace-pre-line">
                          {card.title1}
                        </h1>
                        <p className="text-lg xl:text-xl font-subHeading leading-relaxed break-words">
                          {card.desc1}
                        </p>
                      </div>

                      <Link to={card.link} className="mt-auto">
                        <button className="w-full flex items-center justify-center gap-3 rounded-lg border border-white py-2 px-4 font-subHeading text-[16px] text-white font-light hover:bg-white hover:text-black transition-all duration-300">
                          Explore Products <HiOutlineArrowNarrowRight />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Layout - One card visible for all other screen sizes */}
          <div className="xl:hidden">
            <Slider ref={sliderRef} {...settings}>
              {cardData.map((card, index) => (
                <div key={index}>
                  <ProductCard card={card} />
                </div>
              ))}
            </Slider>

            {/* Custom Arrows */}
            <div className="flex justify-between px-2 mt-6 mb-5">
              <CustomArrow
                icon={<HiOutlineArrowNarrowLeft />}
                onClick={prevSlide}
              />
              <CustomArrow
                icon={<HiOutlineArrowNarrowRight />}
                onClick={nextSlide}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurProducts;
