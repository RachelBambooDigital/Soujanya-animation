import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OurGlobalPresence from '@/sections/OurGlobalPresence';
import { benefitImg, useCaseImg, guideImg } from '../lib/images';
import ButtonSlider from '../sections/ButtonSlider';
import '../index.css';

const ProductDetail = () => {
    const { productId } = useParams();
    const [productData, setProductData] = useState(null);
    const [moreDetails, setMoreDetails] = useState([]);
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState(''); // Initialize product category
    const [card1, setCard1] = useState({ heading: '', description: '' });
    const [card2, setCard2] = useState({ heading: '', description: '' });
    const [card3, setCard3] = useState({ heading: '', description: '' });
    const [applicationTitle, setApplicationTitle] = useState('');
    const [applicationDesc, setApplicationDesc] = useState('');

    const [activeCategory, setActiveCategory] = useState('');
    const [buttons, setButtons] = useState([]);
    const [activeCards, setActiveCards] = useState([]);

    const [cards1, setCards1] = useState({ heading: '', description: '' });
    const [secondImageUrl, setSecondImageUrl] = useState('');

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/productDet/${productId}`);
                console.log("Response Status:", response);
                console.log("Product ID from URL:", productId);

                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched product data:", data);
                    setProductData(data);

                    const mediaEdges = data.media?.edges;

                    if (mediaEdges && mediaEdges.length > 1) {
                        const secondImage = mediaEdges[1]?.node?.image;
                        const url = secondImage?.url;

                        if (url) {
                            setSecondImageUrl(url); // Set only the second image URL
                        }
                    }


                    if (data.metafields && data.metafields.edges.length > 0) {
                        console.log("Metafields edges:", data.metafields.edges);

                        const metafields = data.metafields.edges;

                        // Fetch buttons
                        const buttons = data.metafields.edges.filter(mf => mf.node.key.startsWith('button')).map(b => b.node.value);
                        setButtons(buttons);

                        // Set initial active category and cards
                        if (buttons.length > 0) {
                            setActiveCategory(`button1`);
                            handleButtonClick(1, metafields);
                        }

                        // Fetch cards
                        const benefitsTitle = metafields.find(mf => mf.node.key === 'benefitstitle');
                        const benefitsDesc = metafields.find(mf => mf.node.key === 'benefitsdesc');
                        if (benefitsTitle && benefitsDesc) {                            
                            setCards1({
                                heading: benefitsTitle.node.value,
                                description: benefitsDesc.node.value,
                            });
                        }

                        // Retrieve the bulletpoints metafield
                        const bulletpointMetafield = data.metafields.edges.find(
                            (mf) => mf.node.namespace === 'custom' && mf.node.key === 'bulletpoints'
                        );
                        if (bulletpointMetafield && bulletpointMetafield.node.value) {
                            const details = bulletpointMetafield.node.value;
                            const parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
                            const bulletPoints = [];

                            if (parsedDetails.type === "root" && Array.isArray(parsedDetails.children)) {
                                parsedDetails.children.forEach((child) => {
                                    if (child.listType === "unordered" && child.type === "list" && child.children) {
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
                                setMoreDetails(['Default Value']);
                            }
                        } else {
                            console.log("Bulletpoints metafield not found.");
                            setMoreDetails(['Default Value']);
                        }

                        // Retrieve the product description metafield
                        const descriptionMetafield = data.metafields.edges.find(
                            (mf) => mf.node.namespace === 'custom' && mf.node.key === 'productdescriptions'
                        );
                        if (descriptionMetafield && descriptionMetafield.node.value) {
                            setProductDescription(descriptionMetafield.node.value);
                        } else {
                            console.log("Product description metafield not found.");
                        }

                        // Retrieve the product category metafield
                        const categoryMetafield = data.metafields.edges.find(
                            (mf) => mf.node.namespace === 'custom' && mf.node.key === 'productcategory'
                        );
                        if (categoryMetafield && categoryMetafield.node.value) {
                            setProductCategory(categoryMetafield.node.value);
                        } else {
                            console.log("Product category metafield not found.");
                        }

                        // Retrieve card 1 heading and description
                        const card1TitleMetafield = data.metafields.edges.find(
                            (mf) => mf.node.namespace === 'custom' && mf.node.key === 'card1title'
                        );
                        const card1DescMetafield = data.metafields.edges.find(
                            (mf) => mf.node.namespace === 'custom' && mf.node.key === 'card1desc'
                        );
                        if (card1TitleMetafield && card1TitleMetafield.node.value &&
                            card1DescMetafield && card1DescMetafield.node.value) {
                            setCard1({
                                heading: card1TitleMetafield.node.value,
                                description: card1DescMetafield.node.value,
                            });
                        }

                        // Retrieve card 2 heading and description
                        const card2TitleMetafield = data.metafields.edges.find(
                            (mf) => mf.node.namespace === 'custom' && mf.node.key === 'card2title'
                        );
                        const card2DescMetafield = data.metafields.edges.find(
                            (mf) => mf.node.namespace === 'custom' && mf.node.key === 'card2desc'
                        );
                        if (card2TitleMetafield && card2TitleMetafield.node.value &&
                            card2DescMetafield && card2DescMetafield.node.value) {
                            setCard2({
                                heading: card2TitleMetafield.node.value,
                                description: card2DescMetafield.node.value,
                            });
                        }

                        // Retrieve card 3 heading and description
                        const card3TitleMetafield = data.metafields.edges.find(
                            (mf) => mf.node.namespace === 'custom' && mf.node.key === 'card3title'
                        );
                        const card3DescMetafield = data.metafields.edges.find(
                            (mf) => mf.node.namespace === 'custom' && mf.node.key === 'card3desc'
                        );
                        if (card3TitleMetafield && card3TitleMetafield.node.value &&
                            card3DescMetafield && card3DescMetafield.node.value) {
                            setCard3({
                                heading: card3TitleMetafield.node.value,
                                description: card3DescMetafield.node.value,
                            });
                        }

                        // Retrieve application title
                        const appTitleMetafield = data.metafields.edges.find(
                            (mf) => mf.node.namespace === 'custom' && mf.node.key === 'applicationheader'
                        );
                        console.log("Application title metafield:", appTitleMetafield); // Debug log
                        if (appTitleMetafield && appTitleMetafield.node.value) {
                            setApplicationTitle(appTitleMetafield.node.value);
                        } else {
                            console.log("Application title metafield not found.");
                        }

                        // Retrieve application description
                        const appDescMetafield = data.metafields.edges.find(
                            (mf) => mf.node.namespace === 'custom' && mf.node.key === 'applicationdesc'
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

                } else {
                    console.error('Failed to fetch product data', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchProductData();
    }, [productId]); 

    const handleButtonClick = async (buttonIndex, metafields) => {
        const titleMetafield = `benefitstitle${buttonIndex}`;
        const descMetafield = `benefitsdesc${buttonIndex}`;

        const title = metafields.find(mf => mf.node.key === titleMetafield)?.node.value;
        const desc = metafields.find(mf => mf.node.key === descMetafield)?.node.value;

        setActiveCards([{ heading: title || 'Default Title', description: desc || 'Default Description' }]);
        setActiveCategory(`button${buttonIndex}`);
    };   

    if (!productData) {
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
        <div style={{ backgroundImage: `url("/pipe.png")` }}>
            <div className='w-full bg-cover bg-center relative'>
                <div className='w-full h-screen bg-cover bg-center relative'>
                    <video className='w-full h-screen xl:h-full object-cover' autoPlay loop muted playsInline>
                        <source src="/images/productDetail.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className='absolute inset-0 flex flex-col gap-4 lg:gap-10 justify-end text-white font-medium p-5 xl:p-10'>
                        <div className='grid grid-cols-12 gap-4 max-w-screen-xl lg:pr-20 lg:pl-20'>
                            <div className='col-span-12 lg:col-span-4 bg-white bg-opacity-15 backdrop-blur-lg p-5 rounded-md border border-[#bcbcbc]'>
                                <img src="/images/auratoneProduct.png" alt="product" className='mt-5 w-[150px] h-[25px]' />
                                <h1 className='text-[32px] leading-10 lg:text-[40px] lg:leading-[80px] font-semibold'>
                                    {productData?.title || 'Auratone'}
                                </h1>
                                <h2 className='font-normal text-[24px] mb-2 lg:leading-[30px]'>
                                    {productCategory || 'Home and Personal Care Colorants'}
                                </h2>

                                <ul className='pl-0 font-subHeading font-light lg:text-[15px] lg:leading-[35px] mt-8 mb-8'>
                                    {moreDetails.map((detail, index) => (
                                        <li key={index} className='flex items-center mb-2'>
                                            <img src="/images/bulletProduct.png" alt="bullet icon" className='w-5 h-5 mr-3' />
                                            {detail.trim()}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className='hidden lg:flex col-span-12 lg:col-span-8 bg-white bg-opacity-15 backdrop-blur-lg p-5 rounded-md border border-[#bcbcbc] flex-col justify-center gap-0 text-[18px] leading-6'>
                                {productDescription ? (
                                    productDescription.split('\n').map((paragraph, index) => (
                                        <p key={index} className='font-subHeading font-light mb-4'>
                                            {paragraph.trim()}
                                        </p>
                                    ))
                                ) : (
                                    <p className='font-subHeading font-light'>Product description here...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='lg:hidden px-5 mt-10'>
                    {productDescription ? (
                        productDescription.split('\n').map((paragraph, index) => (
                            <p key={index} className='font-subHeading font-light text-[18px] lg:text-[20px] leading-5 sm:leading-8 md:leading-8 lg:leading-[30px] mb-5'>
                                {paragraph.trim()}
                            </p>
                        ))
                    ) : (
                        <p className='font-subHeading font-light'>Product description here...</p>
                    )}
                </div>

                {/* Second Section */}
                <div className='p-5 lg:p-16 mt-5'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        
                        {/* Card 1 */}
                        <div className="w-full flex flex-col bg-gradient-to-tr from-[#42AC51] to-[#B0CD1B] lg:gap-2 p-5 lg:p-8 text-white font-subHeading rounded-lg">
                            <div className='w-[15%] h-[30%] mt-3'>
                                <img src="/images/productCardIcon.png" alt="Icon" className='w-full h-full object-contain'/>
                            </div>
                            <h1 className='font-normal text-[32px] lg:text-[24px] leading-[35px] lg:leading-[35px] mt-3 sm:h-[50px] md:h-[150px] lg:h-[60px]'>
                                {card1.heading || 'Default Heading 1'}
                            </h1>
                            <div className='font-light text-[14px] sm:h-[50px] md:h-[100px] lg:h-[70px]'>
                                <p>{card1.description || 'Default Description 1'}</p>
                            </div>  
                        </div>

                        {/* Card 2 */}
                        <div className="w-full flex flex-col bg-gradient-to-br from-[#019ACC] to-[#2C2982] lg:gap-2 p-5 lg:p-8 text-white font-subHeading rounded-lg">
                            <div className='w-[15%] h-[30%] mt-3'>
                                <img src="/images/productCardIcon.png" alt="Icon" className='w-full h-full object-contain'/>
                            </div>
                            <h1 className='font-normal text-[32px] lg:text-[24px] leading-[35px] lg:leading-[35px] mt-3 sm:h-[50px] md:h-[150px] lg:h-[60px]'>
                                {card2.heading || 'Default Heading 2'}
                            </h1>
                            <div className='font-light text-[14px] sm:h-[50px] md:h-[100px] lg:h-[70px]'>
                                <p>{card2.description || 'Default Description 2'}</p>
                            </div>  
                        </div>

                        {/* Card 3 */}
                        <div className="w-full flex flex-col bg-gradient-to-bl from-purple to-violet lg:gap-2 p-5 lg:p-8 text-white font-subHeading rounded-lg">
                            <div className='w-[15%] h-[30%] mt-3'>
                                <img src="/images/productCardIcon.png" alt="Icon" className='w-full h-full object-contain'/>
                            </div>
                            <h1 className='font-normal text-[32px] lg:text-[24px] leading-[35px] lg:leading-[35px] mt-3 sm:h-[50px] md:h-[150px] lg:h-[60px]'>
                                {card3.heading || 'Default Heading 3'}
                            </h1>
                            <div className='font-light text-[14px] sm:h-[50px] md:h-[100px] lg:h-[70px]'>
                                <p>{card3.description || 'Default Description 3'}</p>
                            </div>        
                        </div>
                    </div>
                </div>

                {/* Applications Section */}
                <div className='p-5 lg:p-10 w-full items-start grid grid-cols-12'>
                    <p className='col-span-12 lg:col-span-5 py-3 sm:py-5 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[15px]'>
                        {applicationTitle || 'Applications'}
                    </p>
                    <div className='col-span-12 lg:col-span-7 py-3 sm:py-5 lg:py-10'>
                        {applicationDesc ? (
                            applicationDesc.split('\n').map((paragraph, index) => (
                                <p key={index} className='font-subHeading font-light text-[18px] lg:text-[20px] leading-5 sm:leading-8 md:leading-8 lg:leading-[30px] mb-5'>
                                    {paragraph.trim()}
                                </p>
                            ))
                        ) : (
                            <p className='font-subHeading font-light text-[28px] lg:text-[20px] leading-8 sm:leading-10 md:leading-[60px] lg:leading-[30px]'>
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
                                onClick={() => handleButtonClick(index + 1, productData.metafields.edges)}
                                className={`px-6 py-2 border rounded-md transition-all duration-300 ease-in-out w-[10rem] lg:w-[20rem] ${activeCategory === `button${index + 1}` ? 'bg-red text-white shadow-lg' : 'bg-white text-black border border-gray-300 hover:bg-[#d2d3d3]'}`}
                            >
                                {button}
                            </button>
                        ))}
                    </div>

                    {/* Content based on active cards */}
                    <div className="content-section px-5 lg:px-10">
                        <div className="flex flex-col lg:flex-row gap-10">
                            <div className='flex flex-col'>
                                {activeCards.map((card, index) => (
                                    <div key={index}>
                                        <div className='pr-44 pl-44 mt-20'>
                                            {/* Conditionally apply background for larger screens only */}
                                            <div className='hidden lg:flex flex-col lg:flex-row items-start gap-5 mb-16 border border-[#E6E6E6] bg-white bg-opacity-15 backdrop-blur-lg rounded-lg'>
                                                {/* Left Side: Text */}
                                                <div className='w-full lg:w-1/2 px-5 lg:px-10'>
                                                    <h1 className='font-semibold text-[26px] ml-10 mt-14'>{card.heading}</h1>
                                                    <p className='font-subHeading font-normal ml-10 mt-5 text-[15px] leading-5'>
                                                        {card.description}
                                                    </p>
                                                </div>

                                                {/* Right Side: Image */}
                                                <div className='w-full lg:w-1/2'>
                                                    {secondImageUrl && (
                                                        <img 
                                                            src={secondImageUrl} 
                                                            alt="Product Image" 
                                                            className='w-full h-auto lg:h-[340px] object-cover rounded-lg mb-5 lg:mb-0'
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* For smaller screens, show image above title and description without the background */}
                                        <div className="lg:hidden">
                                            <div className='flex flex-col items-start mb-16'>
                                                {secondImageUrl && (
                                                    <img 
                                                        src={secondImageUrl} 
                                                        alt="Product Image" 
                                                        className='w-full object-cover rounded-lg mb-5'
                                                    />
                                                )}
                                                <h1 className='font-semibold text-[22px] mt-5 text-start'>{card.heading}</h1>
                                                <p className='font-subHeading font-normal mt-3 text-[15px] text-start'>
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

            <OurGlobalPresence />
        </div>
    );
};

export default ProductDetail;