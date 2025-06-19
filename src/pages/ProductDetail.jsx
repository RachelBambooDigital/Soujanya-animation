import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import OurGlobalPresence from "@/sections/OurGlobalPresence";
// import { benefitImg, useCaseImg, guideImg } from "../lib/images";
// import ButtonSlider from "../sections/ButtonSlider";
import "../index.css";
import Loader from "../pages/Loader";

const ProductDetail = ({ language, setLoading }) => {
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [moreDetails, setMoreDetails] = useState([]);
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState(""); // Initialize product category
  const [card1, setCard1] = useState({ heading: "", description: "" });
  const [card2, setCard2] = useState({ heading: "", description: "" });
  const [card3, setCard3] = useState({ heading: "", description: "" });
  const [applicationTitle, setApplicationTitle] = useState("");
  const [applicationDesc, setApplicationDesc] = useState("");

  const [activeCategory, setActiveCategory] = useState("");
  const [buttons, setButtons] = useState([]);
  const [activeCards, setActiveCards] = useState([]);

  const [cards1, setCards1] = useState({ heading: "", description: "" });
  const [secondImageUrl, setSecondImageUrl] = useState("");

  // const [svgContent, setSvgContent] = useState(""); // State to hold SVG content
  const svgContainerRef = useRef(null);
  // const scrollContainerRef = useRef(null);
  const pathRef = useRef(null);
  const previousProductIdRef = useRef(null);

  const [benefitImageUrl, setBenefitImageUrl] = useState("");

  useEffect(() => {
    if (!productData) return; // Only run animation after data is loaded

    const path = pathRef.current;
    if (!path) return;

    const pathLength = path.getTotalLength();

    const handleOffset = (mPercent) => {
      const distance = window.scrollY;
      const totalDistance = document.body.scrollHeight - window.innerHeight;
      const percentage =
        typeof mPercent === "number" ? mPercent : distance / totalDistance;

      // Clamp percentage value
      const clampedPercentage = Math.min(Math.max(percentage, 0), 1);

      // Update stroke dash values
      const offset = pathLength - pathLength * clampedPercentage * 0.5;

      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = offset;
    };

    // Initial setup
    handleOffset(0);

    // Add scroll listener
    window.addEventListener("scroll", () => handleOffset());

    return () => {
      window.removeEventListener("scroll", () => handleOffset());
    };
  }, [productData]); // Depend on productData instead of key

  useEffect(() => {
    // Set loading to true whenever productId changes
    if (previousProductIdRef.current !== productId) {
      setLoading(true);
      setProductData(null); // Reset product data to ensure loader shows
      previousProductIdRef.current = productId;
    }

    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/shopify/productDet/${productId}?targetLanguage=${language}`
        );
        console.log("Response Status:", response);
        console.log("Product ID from URL:", productId);
        console.log("Current language:", language);

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched product data:", data);
          setProductData(data);

          const mediaEdges = data.media?.edges;

          if (mediaEdges && mediaEdges.length > 1) {
            const secondImage = mediaEdges[1]?.node?.image;
            const url = secondImage?.url;

            if (url) {
              setSecondImageUrl(url); // Set only the second image
            }
          }

          if (data.metafields && data.metafields.edges.length > 0) {
            console.log("Metafields edges:", data.metafields.edges);

            const metafields = data.metafields.edges;

            // Fetch buttons
            const buttons = data.metafields.edges
              .filter((mf) => mf.node.key.startsWith("button"))
              .sort((a, b) => a.node.key.localeCompare(b.node.key))
              .map((b) => b.node.value);
            setButtons(buttons);

            // Set initial active category and cards
            if (buttons.length > 0) {
              setActiveCategory(`button1`);
              handleButtonClick(1, metafields);
            }

            // Fetch cards
            const benefitsTitle = metafields.find(
              (mf) => mf.node.key === "benefitstitle"
            );
            const benefitsDesc = metafields.find(
              (mf) => mf.node.key === "benefitsdesc"
            );
            if (benefitsTitle && benefitsDesc) {
              setCards1({
                heading: benefitsTitle.node.value,
                description: benefitsDesc.node.value,
              });
            }

            // Check benefit and usecase images for initial load
            const benefitImage1 = metafields.find(
              (mf) => mf.node.key === "benefitimage1"
            );

            console.log("Initial benefit image 1:", benefitImage1?.node.value);

            if (benefitImage1) {
              setBenefitImageUrl(benefitImage1.node.value || "");
            }

            // Retrieve the bulletpoints metafield
            const bulletpointMetafield = data.metafields.edges.find(
              (mf) =>
                mf.node.namespace === "custom" && mf.node.key === "bulletpoints"
            );
            if (bulletpointMetafield && bulletpointMetafield.node.value) {
              const details = bulletpointMetafield.node.value;
              const parsedDetails =
                typeof details === "string" ? JSON.parse(details) : details;
              const bulletPoints = [];

              if (
                parsedDetails.type === "root" &&
                Array.isArray(parsedDetails.children)
              ) {
                parsedDetails.children.forEach((child) => {
                  if (
                    child.listType === "unordered" &&
                    child.type === "list" &&
                    child.children
                  ) {
                    child.children.forEach((item) => {
                      if (item.type === "list-item" && item.children) {
                        item.children.forEach((subChild) => {
                          if (subChild.type === "text" && subChild.value) {
                            bulletPoints.push(subChild.value);
                          }
                        });
                      }
                    });
                  }
                });
                setMoreDetails(bulletPoints);
              } else {
                console.log("Details structure is not as expected.");
                setMoreDetails(["Default Value"]);
              }
            } else {
              console.log("Bulletpoints metafield not found.");
              setMoreDetails(["Default Value"]);
            }

            // Retrieve the product description metafield
            const descriptionMetafield = data.metafields.edges.find(
              (mf) =>
                mf.node.namespace === "custom" &&
                mf.node.key === "productdescriptions"
            );
            if (descriptionMetafield && descriptionMetafield.node.value) {
              setProductDescription(descriptionMetafield.node.value);
            } else {
              console.log("Product description metafield not found.");
            }

            // Retrieve the product category metafield
            const categoryMetafield = data.metafields.edges.find(
              (mf) =>
                mf.node.namespace === "custom" &&
                mf.node.key === "productcategory"
            );
            if (categoryMetafield && categoryMetafield.node.value) {
              setProductCategory(categoryMetafield.node.value);
            } else {
              console.log("Product category metafield not found.");
            }

            // Retrieve card 1 heading and description
            const card1TitleMetafield = data.metafields.edges.find(
              (mf) =>
                mf.node.namespace === "custom" && mf.node.key === "card1title"
            );
            const card1DescMetafield = data.metafields.edges.find(
              (mf) =>
                mf.node.namespace === "custom" && mf.node.key === "card1desc"
            );
            if (
              card1TitleMetafield &&
              card1TitleMetafield.node.value &&
              card1DescMetafield &&
              card1DescMetafield.node.value
            ) {
              setCard1({
                heading: card1TitleMetafield.node.value,
                description: card1DescMetafield.node.value,
              });
            }

            // Retrieve card 2 heading and description
            const card2TitleMetafield = data.metafields.edges.find(
              (mf) =>
                mf.node.namespace === "custom" && mf.node.key === "card2title"
            );
            const card2DescMetafield = data.metafields.edges.find(
              (mf) =>
                mf.node.namespace === "custom" && mf.node.key === "card2desc"
            );
            if (
              card2TitleMetafield &&
              card2TitleMetafield.node.value &&
              card2DescMetafield &&
              card2DescMetafield.node.value
            ) {
              setCard2({
                heading: card2TitleMetafield.node.value,
                description: card2DescMetafield.node.value,
              });
            }

            // Retrieve card 3 heading and description
            const card3TitleMetafield = data.metafields.edges.find(
              (mf) =>
                mf.node.namespace === "custom" && mf.node.key === "card3title"
            );
            const card3DescMetafield = data.metafields.edges.find(
              (mf) =>
                mf.node.namespace === "custom" && mf.node.key === "card3desc"
            );
            if (
              card3TitleMetafield &&
              card3TitleMetafield.node.value &&
              card3DescMetafield &&
              card3DescMetafield.node.value
            ) {
              setCard3({
                heading: card3TitleMetafield.node.value,
                description: card3DescMetafield.node.value,
              });
            }

            // Retrieve application title
            const appTitleMetafield = data.metafields.edges.find(
              (mf) =>
                mf.node.namespace === "custom" &&
                mf.node.key === "applicationheader"
            );
            console.log("Application title metafield:", appTitleMetafield); // Debug log
            if (appTitleMetafield && appTitleMetafield.node.value) {
              setApplicationTitle(appTitleMetafield.node.value);
            } else {
              console.log("Application title metafield not found.");
            }

            // Retrieve application description
            const appDescMetafield = data.metafields.edges.find(
              (mf) =>
                mf.node.namespace === "custom" &&
                mf.node.key === "applicationdesc"
            );
            console.log("Application description metafield:", appDescMetafield); // Debug log
            if (appDescMetafield && appDescMetafield.node.value) {
              setApplicationDesc(appDescMetafield.node.value);
            } else {
              console.log("Application description metafield not found.");
            }
          } else {
            console.log("No metafields found.");
          }
          setLoading(false); // Set loading to false once data is fetched
        } else {
          console.error("Failed to fetch product data", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchProductData();
  }, [productId, language, setLoading]);

  //width="3600" height="4026" viewBox="100 0 4936 4750"
  const [viewBox, setViewBox] = useState("100 0 4936 4750");
  const [width, setWidth] = useState("3600");
  const [height, setHeight] = useState("4026");

  useEffect(() => {
    const updateSVGSize = () => {
      if (window.innerWidth <= 768) {
        setViewBox("850 0 2000 3350");
        setWidth("2100");
        setHeight("4100");
      } else {
        setViewBox("100 0 4936 4750");
        setWidth("3600");
        setHeight("4026");
      }
    };

    updateSVGSize(); // Initial check
    window.addEventListener("resize", updateSVGSize);

    return () => window.removeEventListener("resize", updateSVGSize);
  }, []);

  const handleButtonClick = async (buttonIndex, metafields) => {
    console.log(
      `Button ${buttonIndex} clicked. Looking for related metafields.`
    );

    const titleMetafield = `benefitstitle${buttonIndex}`;
    const descMetafield = `benefitsdesc${buttonIndex}`;
    const benefitImageMetafield = `benefitimage${buttonIndex}`;

    const title = metafields.find((mf) => mf.node.key === titleMetafield)?.node
      .value;
    const desc = metafields.find((mf) => mf.node.key === descMetafield)?.node
      .value;
    const benefitImageMeta = metafields.find(
      (mf) => mf.node.key === benefitImageMetafield
    );

    const benefitImage = benefitImageMeta?.node.value;
    console.log(`Benefits Image ${buttonIndex}:`, benefitImage);

    // Create array with both cards
    const cardsData = [
      {
        heading: title || "Default Title",
        description: desc || "Default Description",
      },
    ];

    // Set active cards and category
    setActiveCards(cardsData);
    setActiveCategory(`button${buttonIndex}`);

    // Set image URLs
    setBenefitImageUrl(benefitImage || "");
  };

  console.log(productData);

  if (!productData) {
    return <Loader />;
  }

  return (
    <div
      className="scrollContainer w-full relative min-h-screen overflow-hidden bg-no-repeat"
      ref={svgContainerRef}
    >
      <svg
        className="absolute inset-0 pointer-events-none"
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeOpacity="0.55"
          strokeWidth="21"
          speed="2"
          stay=".7"
          className="scrollPath cls-3"
          style={{ strokeDasharray: "80000", zIndex: 5 }}
          ref={pathRef}
          stroke-width="90"
          d="M445.634 0.836114C454.975 -1.82847 462.56 2.21838 469.367 8.13043C488.641 24.884 511.766 69.8656 532.391 93.0475C808.928 403.971 1393.2 266.645 1760.87 255.937C1957.97 250.208 2318.88 285.83 2398.03 500.613C2406.61 523.911 2419.87 566.328 2410.06 589.326C2407.31 595.771 2399.84 599.652 2398.47 606.929C2397.1 614.207 2401.51 621.118 2401.51 628.562C2401.53 654.226 2360.77 702.521 2341.34 719.775C2184.33 859.232 1792.34 817.831 1592.58 812.286C1380.58 806.39 1169.45 800.978 956.952 796.565C710.279 791.435 294.654 755.18 117.475 962.668C-11.1398 1113.28 134.097 1314.31 285.465 1378.99C826.614 1610.25 1464.22 1200.98 2032.37 1356.91C2271.61 1422.56 2502.59 1627.33 2418.27 1895.62C2349.03 2115.92 2079.59 2213.46 1870.2 2250.3C1528.13 2310.47 1181.17 2264.73 837.306 2260.74C654.671 2258.61 378.337 2262.02 234.131 2385.51C78.438 2518.84 193.995 2674.38 343.86 2741.06C576.428 2844.55 976.073 2806.36 1232.76 2801.4C1489.45 2796.44 1899.47 2756.93 2141.8 2857.32C2448.08 2984.21 2356.99 3259.64 2114.91 3396.55C1545.75 3718.43 613.894 3033.77 132.205 3621.51C41.5291 3732.16 30.3467 3842.82 69.671 3977.2C141.546 4222.79 450.178 4339 679.908 4388.86C1123.1 4485.07 1685.04 4433.97 2044.71 4743.7C2104.27 4794.99 2165.43 4866.4 2185.63 4943.61C2191.21 4964.89 2204.38 5017.33 2174.44 5025.38C2143.46 5033.71 2136.19 4956.02 2129.06 4935.47C2068.27 4760.15 1824.82 4643.28 1657.34 4591.8C1240.99 4463.85 771.056 4519.94 369.789 4336.63C116.546 4220.94 -85.5317 3988.7 36.5798 3699.86C161.833 3403.65 512.729 3315.31 811.343 3325.52C1212.8 3339.23 1754.55 3559.52 2122.15 3339.78C2188.3 3300.24 2217.76 3276.09 2253.78 3207.42C2392.19 2943.5 2080.01 2861.6 1880.89 2846.06C1522.9 2818.1 1162.69 2855.54 804.84 2855.76C593.995 2855.89 254.924 2836.37 139.198 2629.57C12.8129 2403.71 302.83 2262.97 484.739 2233.04C810.347 2179.45 1163.93 2251.18 1495.31 2241.84C1754.18 2234.54 2212.41 2191.88 2354.27 1944.4C2472.83 1737.56 2354.01 1568.78 2170.8 1463.38C1858.02 1283.45 1393.61 1404.67 1056.55 1460.51C743.387 1512.41 315.161 1552.76 95.0933 1275.79C11.7318 1170.87 -19.9067 1071.12 64.6204 952.11C232.12 716.277 689.924 738.477 947.492 745.155C1247.69 752.932 1548.2 771.701 1848.66 773.932C1986.88 774.965 2237.93 777.746 2333.07 660.488C2340.04 651.894 2366.63 610.693 2368.22 602.183C2369.54 595.139 2363.4 552.622 2361.48 543.079C2333.61 404.904 2155.25 344.001 2031.73 321.552C1547 233.504 862.644 532.338 486.985 112.232C471.884 95.3457 428.928 42.7367 430.381 21.2368C430.82 14.692 439.249 2.63474 445.6 0.819495L445.634 0.836114Z"
          fill="url(#paint0_angular_2834_3931)
          "
        />
        <defs>
          <radialGradient
            id="paint0_angular_2834_3931"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(1218.59 2337.99) rotate(-90) scale(2962 3004.37)"
          >
            <stop offset="0.06" stop-color="#9D2924" />
            <stop offset="0.265" stop-color="#EA5C50" />
            <stop offset="0.515" stop-color="#E4A16B" />
            <stop offset="0.76" stop-color="#80B2BD" />
            <stop offset="0.96" stop-color="#D88BD3" />
          </radialGradient>
        </defs>
      </svg>
      <div className="w-full relative z-10">
        <div className="w-full bg-cover bg-center relative">
          <div className="w-full h-[100dvh] bg-cover bg-center relative">
            <video
              className="w-full h-screen xl:h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/images/productDetail.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 flex flex-col gap-4 lg:gap-10 justify-end text-white font-medium p-5 xl:p-10">
              <div className="grid grid-cols-12 gap-4 max-w-screen-xl lg:pr-20 lg:pl-20">
                <div className="col-span-12 lg:col-span-4 bg-white bg-opacity-15 backdrop-blur-lg p-5 rounded-md border border-[#bcbcbc]">
                  <img
                    src="/images/auratoneProduct.png"
                    alt="product"
                    className="mt-5 w-[150px] h-[25px]"
                  />
                  <h1 className="text-[32px] leading-10 lg:text-[40px] lg:leading-[80px] font-semibold">
                    {productData?.title || "Auratone"}
                  </h1>
                  <h2 className="font-normal text-[24px] mb-2 lg:leading-[30px]">
                    {productCategory || "Home and Personal Care Colorants"}
                  </h2>

                  <ul className="pl-0 font-subHeading font-light lg:text-[15px] lg:leading-[35px] mt-8 mb-8">
                    {moreDetails.map((detail, index) => (
                      <li key={index} className="flex items-center mb-2">
                        <img
                          src="/images/bulletProduct.png"
                          alt="bullet icon"
                          className="w-5 h-5 mr-3"
                        />
                        {detail.trim()}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden lg:flex col-span-12 lg:col-span-8 bg-white bg-opacity-15 backdrop-blur-lg p-5 rounded-md border border-[#bcbcbc] flex-col justify-center gap-0 text-[18px] leading-6">
                  {productDescription ? (
                    productDescription.split("\n").map((paragraph, index) => (
                      <p
                        key={index}
                        className="font-subHeading font-light mb-4"
                      >
                        {paragraph.trim()}
                      </p>
                    ))
                  ) : (
                    <p className="font-subHeading font-light">
                      Product description here...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden px-5 mt-10">
            {productDescription ? (
              productDescription.split("\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="font-subHeading font-light text-[18px] lg:text-[20px] leading-5 sm:leading-8 md:leading-8 lg:leading-[30px] mb-5"
                >
                  {paragraph.trim()}
                </p>
              ))
            ) : (
              <p className="font-subHeading font-light">
                Product description here...
              </p>
            )}
          </div>

          {/* Second Section */}
          <div className="p-5 lg:p-16 mt-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="w-full flex flex-col bg-gradient-to-tr from-[#42AC51] to-[#B0CD1B] lg:gap-2 p-5 lg:p-8 text-white font-subHeading rounded-lg">
                <div className="w-[15%] h-[30%] mt-3">
                  <img
                    src="/images/productCardIcon.png"
                    alt="Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="font-normal text-[32px] lg:text-[24px] leading-[35px] lg:leading-[35px] mt-3 sm:h-[50px] md:h-[150px] lg:h-[60px]">
                  {card1.heading || "Default Heading 1"}
                </h1>
                <div className="font-light text-[14px] sm:h-[50px] md:h-[100px] lg:h-[70px]">
                  <p>{card1.description || "Default Description 1"}</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="w-full flex flex-col bg-gradient-to-br from-[#019ACC] to-[#2C2982] lg:gap-2 p-5 lg:p-8 text-white font-subHeading rounded-lg">
                <div className="w-[15%] h-[30%] mt-3">
                  <img
                    src="/images/productCardIcon.png"
                    alt="Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="font-normal text-[32px] lg:text-[24px] leading-[35px] lg:leading-[35px] mt-3 sm:h-[50px] md:h-[150px] lg:h-[60px]">
                  {card2.heading || "Default Heading 2"}
                </h1>
                <div className="font-light text-[14px] sm:h-[50px] md:h-[100px] lg:h-[70px]">
                  <p>{card2.description || "Default Description 2"}</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="w-full flex flex-col bg-gradient-to-bl from-purple to-violet lg:gap-2 p-5 lg:p-8 text-white font-subHeading rounded-lg">
                <div className="w-[15%] h-[30%] mt-3">
                  <img
                    src="/images/productCardIcon.png"
                    alt="Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="font-normal text-[32px] lg:text-[24px] leading-[35px] lg:leading-[35px] mt-3 sm:h-[50px] md:h-[150px] lg:h-[60px]">
                  {card3.heading || "Default Heading 3"}
                </h1>
                <div className="font-light text-[14px] sm:h-[50px] md:h-[100px] lg:h-[70px]">
                  <p>{card3.description || "Default Description 3"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Applications Section */}
          <div className="p-5 lg:p-10 w-full items-start grid grid-cols-12">
            <p className="col-span-12 lg:col-span-5 py-3 sm:py-5 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[15px]">
              {applicationTitle || "Applications"}
            </p>
            <div className="col-span-12 lg:col-span-7 py-3 sm:py-5 lg:py-10">
              {applicationDesc ? (
                applicationDesc.split("\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="font-subHeading font-light text-[28px] lg:text-[20px] leading-8 sm:leading-10 md:leading-[60px] lg:leading-[30px] mb-5"
                  >
                    {paragraph.trim()}
                  </p>
                ))
              ) : (
                <p className="font-subHeading font-light text-[28px] lg:text-[20px] leading-8 sm:leading-10 md:leading-[60px] lg:leading-[30px]">
                  Default application description...
                </p>
              )}
            </div>
          </div>

          {/* Dynamic Content Section */}
          <div className="w-full flex flex-col px-5 lg:px-10 mt-10">
            {/* Buttons */}
            <div className="flex justify-center flex-wrap gap-4 py-5">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleButtonClick(index + 1, productData.metafields.edges)
                  }
                  className={`px-6 py-2 border rounded-md transition-all duration-300 ease-in-out w-[10rem] lg:w-[20rem] ${
                    activeCategory === `button${index + 1}`
                      ? "bg-red text-white shadow-lg"
                      : "bg-white text-black border border-gray-300 hover:bg-[#d2d3d3]"
                  }`}
                >
                  {button}
                </button>
              ))}
            </div>

            {/* Content based on active cards */}
            <div className="content-section px-5 lg:px-10">
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex flex-col">
                  {activeCategory &&
                    activeCards.length > 0 &&
                    activeCards.map((card, index) => (
                      <div key={index}>
                        <div className="pr-44 pl-44 mt-20">
                          {/* Conditionally apply background for larger screens only */}
                          <div className="hidden lg:flex flex-col lg:flex-row items-start gap-5 mb-16 border border-[#E6E6E6] bg-white bg-opacity-15 backdrop-blur-lg rounded-lg">
                            {/* Left Side: Text */}
                            <div className="w-full lg:w-1/2 px-5 lg:px-10">
                              <h1 className="font-semibold text-[26px] ml-10 mt-14">
                                {card.heading}
                              </h1>
                              <p className="font-subHeading font-normal ml-10 mt-5 text-[15px] leading-5">
                                {card.description}
                              </p>
                            </div>

                            {/* Right Side: Image */}
                            <div className="w-full lg:w-1/2">
                              {index === 0 ? (
                                benefitImageUrl ? (
                                  <img
                                    src={benefitImageUrl}
                                    alt="Benefit Image"
                                    className="w-full h-auto lg:h-[340px] object-cover rounded-lg mb-5 lg:mb-0"
                                  />
                                ) : (
                                  <div className="w-full h-[340px] bg-gray-200 rounded-lg flex items-center justify-center">
                                    <p>No benefit image available</p>
                                  </div>
                                )
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {/* For smaller screens, show image above title and description without the background */}
                        <div className="lg:hidden">
                          <div className="flex flex-col items-start mb-16">
                            {index === 0 ? (
                              benefitImageUrl ? (
                                <img
                                  src={benefitImageUrl}
                                  alt="Benefit Image"
                                  className="w-full h-auto lg:h-[340px] object-cover rounded-lg mb-5 lg:mb-0"
                                />
                              ) : (
                                <div className="w-full h-[340px] bg-gray-200 rounded-lg flex items-center justify-center">
                                  <p>No benefit image available</p>
                                </div>
                              )
                            ) : null}
                            <h1 className="font-semibold text-[22px] mt-5 text-start">
                              {card.heading}
                            </h1>
                            <p className="font-subHeading font-normal mt-3 text-[15px] text-start">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <OurGlobalPresence language={language} /> */}
      </div>
    </div>
  );
};

export default ProductDetail;
