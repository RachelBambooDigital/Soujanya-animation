// Home page comment
import Cards from "@/components/Cards";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { businessCards } from "../lib/contants";
import CustomSlider from "../sections/CustomSlider";
import OurProducts from "../sections/OurProducts";
import OurGlobalPresence from "@/sections/OurGlobalPresence";
import Loader from "../pages/Loader";

const Home = ({language, setLoading}) => {
  const [metaFields, setMetaFields] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [slides, setSlides] = useState([]);
  const [businessHighlights, setBusinessHighlights] = useState([]);

  const navigate = useNavigate();

  const svgContainerRef = useRef(null);
  const pathRef = useRef(null);

  // width="2436" height="5026" viewBox="0 0 2436 5026"
  const [viewBox, setViewBox] = useState("0 0 2436 5026");
  const [width, setWidth] = useState("2436");
  const [height, setHeight] = useState("5026");

  // const [selectedLanguage, setSelectedLanguage] = useState("Eng"); // Store language
  // const handleLanguageChange = (langShort) => {
  //   setSelectedLanguage(langShort);  // Update language state
  // };

  // width="2100" height="5800" viewBox="250 0 2436 5350"

  useEffect(() => {
    if (!metaFields) return; // Ensure animation doesn't run until metaFields are set

    const path = pathRef.current;
    if (!path) return;

    const pathLength = path.getTotalLength(); // Get the total length of the path

    const handleOffset = (mPercent) => {
      const distance = window.scrollY;
      const totalDistance = document.body.scrollHeight - window.innerHeight;
      const percentage =
        typeof mPercent === "number" ? mPercent : distance / totalDistance;

      // Clamp percentage value to ensure it doesn't exceed [0, 1] range
      const clampedPercentage = Math.min(Math.max(percentage, 0), 1);

      // Update the strokeDasharray and strokeDashoffset values
      const offset = pathLength - pathLength * clampedPercentage * 0.6; // Adjust for desired speed

      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = offset;
    };

    window.addEventListener("scroll", () => handleOffset());

    // Trigger initially
    handleOffset(0);

    return () => {
      window.removeEventListener("scroll", () => handleOffset());
    };
  }, [metaFields]);

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
        const homepageResponse1 = await fetch(
          `${import.meta.env.VITE_BASE_URL}/shopify/homepage-meta`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: homepage1, targetLanguage: language }),
          }
        );

        const homepageResult1 = await homepageResponse1.json();
        console.log("result", homepageResult1);

        const homepageResponse2 = await fetch(
          `${import.meta.env.VITE_BASE_URL}/shopify/homepage-meta`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: homepage2, targetLanguage: language }),
          }
        );

        const homepageResult2 = await homepageResponse2.json();
        console.log("result2", homepageResult2);

        if (homepageResult1?.data && homepageResult2?.data) {
          const fields = {};
          const slidesArray = [];

          for (const edge of homepageResult1.data.metaobjects.edges) {
            for (const field of edge.node.fields) {
              if (field.key.startsWith("what_we_offer_card")) {
                const cardIndex = parseInt(field.key.split("_").pop(), 10) - 1;

                if (!slidesArray[cardIndex]) {
                  slidesArray[cardIndex] = { id: cardIndex + 1 };
                }

                if (field.key.includes("title")) {
                  slidesArray[cardIndex].title = field.value; // Use translated title directly
                } else if (
                  field.key.includes("image") &&
                  field.reference?.image?.url
                ) {
                  slidesArray[cardIndex].image = field.reference.image.url;
                } else if (field.key.includes("link")) {
                  slidesArray[cardIndex].link = field.value; // Use translated link directly
                }
              } else {
                if (field.reference?.image?.url) {
                  fields[field.key] = field.reference.image.url;
                } else if (field.reference?.sources) {
                  fields[field.key] = field.reference.sources[0].url;
                } else {
                  fields[field.key] = field.value; // Use translated value directly
                }
              }
            }
          }

          // Replace your existing homepage2 processing with this:

          // Replace your existing homepage2 processing with this:

for (const edge of homepageResult2.data.metaobjects.edges) {
  // First pass: collect ALL fields
  for (const field of edge.node.fields) {
    // Check for highlights (original highlights) - be more specific
    if (field.key.startsWith('highlight') && !field.key.startsWith('highlightss_')) {
      const index = field.key.match(/\d+/)[0]; // Extract number from key
      highlights[index - 1] = highlights[index - 1] || {}; // Ensure array entry exists
      if (field.key.includes('title')) {
        highlights[index - 1].title = field.value;
      } else if (field.key.includes('desc')) {
        highlights[index - 1].desc = field.value;
      }
    } else {
      // Collect ALL fields including highlightss_ fields
      fields[field.key] = field.value;
    }
  }
}

// Second pass: process business highlights after all fields are collected
const newHighlights = [];
// Find all title fields to determine how many highlights we have
const titleFields = Object.keys(fields).filter(key => key.startsWith('highlightss_title_'));

titleFields.forEach(titleKey => {
  const index = parseInt(titleKey.split('_')[2]) - 1;
  const descKey = `highlightss_desc_${index + 1}`;
  const colorKey = `highlightss_color_${index + 1}`;
  
  newHighlights[index] = {
    title: fields[titleKey],
    desc: fields[descKey] || 'Description not available',
    color: fields[colorKey] || '#000000'
  };
});

console.log('All fields:', fields); // Debug log to see all fields
console.log('New highlights:', newHighlights); // Debug log to see processed highlights

          const imageFetchPromises = homepageResult1.data.metaobjects.edges.map(
            async (edge) => {
              for (const field of edge.node.fields) {
                if (field.key === "who_we_are_image") {
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
                    console.error("who_we_are_image is not an array");
                  }
                }
              }
            }
          );

          await Promise.all(imageFetchPromises);
          setMetaFields(fields);
          console.log("slides", slidesArray);
          setSlides(slidesArray.filter((slide) => slide.image && slide.title));
          setHighlights(highlights.filter(h => h.title && h.desc));
          setBusinessHighlights(newHighlights.filter(Boolean));
          console.log("businessHighlights", newHighlights);
          setLoading(false); // Set loading to false once data is fetched
        } else {
          console.error("Metaobjects not found in the response");
        }

      } catch (error) {
        console.error("Error fetching homepage meta fields:", error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchHomePageMeta();
  }, [language, setLoading]);

  console.log("Metafields:", metaFields);

  // width="2436" height="5026" viewBox="0 0 2436 5026"
  useEffect(() => {
    const updateSVGSize = () => {
      if (window.innerWidth <= 768) {
        setViewBox("450 0 990 5000");
        setWidth("900");
        setHeight("5050");
      } else {
        setViewBox("00 0 2436 4926");
        setWidth("2436");
        setHeight("5026");
      }
    };

    updateSVGSize(); // Initial check
    window.addEventListener("resize", updateSVGSize);

    return () => window.removeEventListener("resize", updateSVGSize);
  }, []);

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
    return <Loader />;
  }

  // Redirect functions
  // const handleContactUs = () => {
  //   navigate("/contact-us");
  // };

  // const handleAboutUs = () => {
  //   navigate("/about-us");
  // };

  const handleButtonClick = () => {

    navigate("/");

    setTimeout(() => {
      const section = document.getElementById("whatWeOffer");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div
      className="scrollContainer w-full lg:h-[4900px] h-[6350px] overflow-hidden bg-no-repeat"
      ref={svgContainerRef}
    >
      
      <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M445.634 0.836114C454.975 -1.82847 462.56 2.21838 469.367 8.13043C488.641 24.884 511.766 69.8656 532.391 93.0475C808.928 403.971 1393.2 266.645 1760.87 255.937C1957.97 250.208 2318.88 285.83 2398.03 500.613C2406.61 523.911 2419.87 566.328 2410.06 589.326C2407.31 595.771 2399.84 599.652 2398.47 606.929C2397.1 614.207 2401.51 621.118 2401.51 628.562C2401.53 654.226 2360.77 702.521 2341.34 719.775C2184.33 859.232 1792.34 817.831 1592.58 812.286C1380.58 806.39 1169.45 800.978 956.952 796.565C710.279 791.435 294.654 755.18 117.475 962.668C-11.1398 1113.28 134.097 1314.31 285.465 1378.99C826.614 1610.25 1464.22 1200.98 2032.37 1356.91C2271.61 1422.56 2502.59 1627.33 2418.27 1895.62C2349.03 2115.92 2079.59 2213.46 1870.2 2250.3C1528.13 2310.47 1181.17 2264.73 837.306 2260.74C654.671 2258.61 378.337 2262.02 234.131 2385.51C78.438 2518.84 193.995 2674.38 343.86 2741.06C576.428 2844.55 976.073 2806.36 1232.76 2801.4C1489.45 2796.44 1899.47 2756.93 2141.8 2857.32C2448.08 2984.21 2356.99 3259.64 2114.91 3396.55C1545.75 3718.43 613.894 3033.77 132.205 3621.51C41.5291 3732.16 30.3467 3842.82 69.671 3977.2C141.546 4222.79 450.178 4339 679.908 4388.86C1123.1 4485.07 1685.04 4433.97 2044.71 4743.7C2104.27 4794.99 2165.43 4866.4 2185.63 4943.61C2191.21 4964.89 2204.38 5017.33 2174.44 5025.38C2143.46 5033.71 2136.19 4956.02 2129.06 4935.47C2068.27 4760.15 1824.82 4643.28 1657.34 4591.8C1240.99 4463.85 771.056 4519.94 369.789 4336.63C116.546 4220.94 -85.5317 3988.7 36.5798 3699.86C161.833 3403.65 512.729 3315.31 811.343 3325.52C1212.8 3339.23 1754.55 3559.52 2122.15 3339.78C2188.3 3300.24 2217.76 3276.09 2253.78 3207.42C2392.19 2943.5 2080.01 2861.6 1880.89 2846.06C1522.9 2818.1 1162.69 2855.54 804.84 2855.76C593.995 2855.89 254.924 2836.37 139.198 2629.57C12.8129 2403.71 302.83 2262.97 484.739 2233.04C810.347 2179.45 1163.93 2251.18 1495.31 2241.84C1754.18 2234.54 2212.41 2191.88 2354.27 1944.4C2472.83 1737.56 2354.01 1568.78 2170.8 1463.38C1858.02 1283.45 1393.61 1404.67 1056.55 1460.51C743.387 1512.41 315.161 1552.76 95.0933 1275.79C11.7318 1170.87 -19.9067 1071.12 64.6204 952.11C232.12 716.277 689.924 738.477 947.492 745.155C1247.69 752.932 1548.2 771.701 1848.66 773.932C1986.88 774.965 2237.93 777.746 2333.07 660.488C2340.04 651.894 2366.63 610.693 2368.22 602.183C2369.54 595.139 2363.4 552.622 2361.48 543.079C2333.61 404.904 2155.25 344.001 2031.73 321.552C1547 233.504 862.644 532.338 486.985 112.232C471.884 95.3457 428.928 42.7367 430.381 21.2368C430.82 14.692 439.249 2.63474 445.6 0.819495L445.634 0.836114Z" 
          fill="url(#paint0_angular_2834_2819)"
          fill-opacity="0.5"
          strokeOpacity="0.5"
          strokeWidth="21"
          speed="2"
          stay=".7"
          className="scrollPath cls-6"
          style={{ strokeDasharray: "80000", zIndex: 5 }}
          ref={pathRef}
          stroke-width="80"
        />
        <defs>
        <radialGradient id="paint0_angular_2834_2819" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1218.59 2337.99) rotate(-90) scale(2962 3004.37)">
        <stop stop-color="#42AC51"/>
        <stop offset="0.05" stop-color="#B0CD1A"/>
        <stop offset="0.13" stop-color="#019ACC"/>
        <stop offset="0.2" stop-color="#2C2982"/>
        <stop offset="0.295" stop-color="#B80B79"/>
        <stop offset="0.395" stop-color="#9D2924"/>
        <stop offset="0.445" stop-color="#EA5C50"/>
        <stop offset="0.51" stop-color="#E4A16B"/>
        <stop offset="0.6" stop-color="#80B2BD"/>
        <stop offset="0.645" stop-color="#D88BD3"/>
        <stop offset="0.715" stop-color="#595FB3"/>
        <stop offset="0.765" stop-color="#BF278C"/>
        <stop offset="0.825" stop-color="#74BCD3"/>
        <stop offset="0.915" stop-color="#5B75CA"/>
        <stop offset="1" stop-color="#948EE8"/>
        </radialGradient>
        </defs>
      </svg>

      {/* Main content */}
      <div className="absolute w-full h-full top-[0] z-10 ">
        <div className="w-full h-[100dvh] bg-cover bg-center relative">
          <video
            className="w-full h-screen xl:h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={metaFields.banner_video_or_image} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 flex flex-col gap-4 lg:gap-10 justify-end text-white font-medium p-5 xl:p-10 ">
            <h1 className="w-full lg:w-[550px] text-[32px] leading-10 lg:text-[62px] lg:leading-[70px] font-heading">
              {metaFields.banner_title}
            </h1>
            <button
              onClick={handleButtonClick}
              className="bg-red text-white text-base font-subHeading h-[42px] w-[175px] lg:w-[192px] rounded-lg hover:underline"
            >
              {JSON.parse(metaFields.banner_button_link).text}
              {/* {buttonLink.text} */}
              {/* {metaFields.banner_button} */}
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="w-full flex flex-col px-5 lg:px-10">
            <div className="w-full flex flex-col items-start">
              <p className="py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
                {metaFields.who_we_are_title}
              </p>
              <h1 className="font-heading leading-10 text-[28px] lg:text-[54px] lg:leading-[70px]">
                {metaFields.who_we_are_heading}
              </h1>
              {/* <button
                className="bg-red text-white text-base font-subHeading h-[42px] w-[175px] lg:w-[192px] my-10 rounded-lg hover:underline"
                onClick={handleAboutUs}
              >
                {JSON.parse(metaFields.who_we_are_link).text}
                {metaFields.who_we_are_button}
              </button> */}
            </div>

            {/* <div className="w-full flex gap-5 lg:gap-8 justify-between lg:justify-end mb-5 lg:mb-10 px-3 lg:px-0">
              <div className="w-[110px] sm:w-[170px] md:w-[200px] lg:w-[250px] h-[160px] sm:h-[250px] md:h-[300px] lg:h-[400px] bg-cover bg-center">
                <img
                  src={metaFields.who_we_are_image[0]}
                  className="w-full h-full object-contain" // Ensuring the image maintains aspect ratio
                  alt="Who are we Image 1"
                />
              </div>
              <div className="w-[245px] sm:w-[370px] md:w-[400px] lg:w-[600px] h-[160px] sm:h-[250px] md:h-[300px] lg:h-[400px] bg-cover bg-center">
                <img
                  src={metaFields.who_we_are_image[1]}
                  className="w-full h-full object-contain" // Ensuring the image maintains aspect ratio
                  alt="Who are we Image 2"
                />
              </div>
            </div> */}

            {/* Our business highlights */}
            <div className="w-full flex flex-col px-5 sm:px-8 md:px-10 lg:px-10">
              <div className="w-full flex flex-col items-start mb-5">
                {/* <p className="py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
                  {metaFields.business_highlights_title}
                </p> */}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-10">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex flex-col w-full h-full">
                    <Cards title={highlight.title} desc={highlight.desc} />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* What we offer */}
          <div className="w-full flex flex-col px-5 lg:px-10" id="whatWeOffer">
            <CustomSlider language={language}
              title={metaFields.what_we_offer_title}
              subTitle={metaFields.what_we_offer_heading}
              slides={slides}
            />
          </div>

          <OurProducts language={language}/>

          {/* Business Highlights */}
          <div className="w-full flex flex-col gap-16 mb-16 px-5 lg:px-10">
            <div className="w-full flex flex-col items-start">
              <p className="py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
                {metaFields.business_highlights_title}
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
                    className="flex flex-col text-white p-6 gap-6 rounded-t-[42px] rounded-l-[42px] pt-20 items-start justify-start"
                    style={{
                      backgroundColor: highlight.color,
                      width: '100%', // Cards take up 100% width for smaller screens
                      maxWidth: '350px', // Max width of cards for large screens
                      minHeight: '550px', // Set a minimum height to prevent card collapse
                      height: 'auto', // Ensure dynamic height adjustment based on content
                    }}
                  >
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-heading break-words">
                      {highlight.title}
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl font-subHeading leading-relaxed break-words">
                      {highlight.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <OurGlobalPresence language={language}/>
        </div>
      </div>
    </div>
  );
};

export default Home;