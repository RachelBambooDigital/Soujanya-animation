import React, { useState } from 'react';
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from "react-icons/hi";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';

// Custom arrow component
const CustomArrow = ({ className, style, onClick, icon }) => {
    return (
        <button
            className={`${className} bg-transparent border border-gray-400 py-1 px-3 rounded-sm hover:bg-black hover:text-white transition-all duration-300 ease-in-out`}
            style={{ ...style }}
            onClick={onClick}
        >
            {icon}
        </button>
    );
};

const CustomSlider1 = ({ title, subTitle, slides }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
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
        slidesToShow: 3, // Default for larger screens
        slidesToScroll: 1,
        arrows: false, // Disable default arrows
        swipe: false, // Disable swipe for desktop
        touchMove: false, // Disable touch gestures for desktop
        beforeChange: (oldIndex, newIndex) => {
            setCurrentSlide(newIndex);
        },
        responsive: [
            {
                breakpoint: 1024, // For tablets and smaller screens
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    swipe: true, // Enable swipe for tablet
                    touchMove: true,
                    arrows: false
                }
            },
            {
                breakpoint: 769, // For mobile screens
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    swipe: true, // Enable swipe for mobile
                    touchMove: true,
                    arrows: false
                }
            }
        ]
    };

    const centerIndex = Math.floor(settings.slidesToShow / 2) + currentSlide;

    return (
        <div className="mb-5 lg:mb-10">
            <div className='w-full flex flex-col items-start mb-5 lg:mb-10'>
                <p className='py-7 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]'>{title}</p>
                <h1 className='font-heading text-[28px] lg:text-[54px] leading-10 lg:leading-[70px]'>{subTitle}</h1>
            </div>

            <Slider ref={sliderRef} {...settings}>
                {slides.map((slide, index) => {
                    const isCenter = index === (centerIndex % slides.length);

                    // Parse the link string into an object
                    const linkObject = slide.link ? JSON.parse(slide.link) : null;
                    
                    // Safely construct the full link
                    const fullLink = (linkObject && linkObject.url) ? linkObject.url : '#';
                    console.log(linkObject);
                    console.log(fullLink);

                    return (
                        <div className='w-full px-2 lg:px-4 py-8' key={slide.id}>
                            <Link to={fullLink}>
                                <div className={`w-full h-[300px] md:h-[400px] xl:h-[500px] bg-center bg-cover relative rounded-xl transition-transform duration-300 ${isCenter ? 'lg:scale-110' : 'lg:scale-100'}`}>
                                    <img
                                        src={slide.image}
                                        className='w-full h-full object-cover object-center rounded-xl'
                                        alt={slide.title}
                                    />
                                    <div className='absolute inset-0 flex items-end text-white font-medium p-5 xl:p-7'>
                                        <h1 className='w-[270px] font-heading text-[24px] md:text-[32px] leading-[40px]'>{slide.title}</h1>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </Slider>

            {/* Custom Arrows for desktop */}
            <div className="flex justify-between px-4">
                <CustomArrow icon={<HiOutlineArrowNarrowLeft />} onClick={prevSlide} />
                <CustomArrow icon={<HiOutlineArrowNarrowRight />} onClick={nextSlide} />
            </div>
        </div>
    );
};

export default CustomSlider1;
