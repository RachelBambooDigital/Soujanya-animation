import React, { useState } from "react";
import axios from "axios";
import OurGlobalPresence from "@/sections/OurGlobalPresence";
import { apiBaseUrl } from "../config";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const ContactUs = () => {
    return (
        <div>
            {/* <div className="w-full bg-cover bg-center bg-white relative" style={{ backgroundImage: `url("/pipe.png")` }}> */}
                <div className="w-full h-[700px] lg:h-[880px] bg-cover bg-center  bg-white relative" >
                    <div className="hidden lg:flex inset-x-0 top-0 bg-[#FAF8F8] text-black text-sm items-center space-x-4 px-28 h-8" >
                        <Link to="/"><span>Home</span></Link>
                        <span className="text-gray-400"> &gt; </span>
                        <span>Career</span>
                    </div>

                    {/* Banner */}
                    <div className='w-full flex h-full relative'>
                        <div className='absolute inset-0 flex lg:flex-row flex-col-reverse gap-24 lg:justify-between w-full lg:w-auto items-end lg:items-center px-5 lg:px-10'>
                        <div className='flex flex-col gap-6 text-black mb-20'>
                            <h1 className='font-heading leading-10 text-[28px] lg:text-[50px] lg:leading-[65px]'>Work at a place where your voice matters.</h1>
                            <p className='text-[18px] font-subHeading leading-[26px] lg:w-[500px] text-[#667085]'>We believe there is no greater advantage than extraordinary talent and an inclusive environment.</p>
                            {/* <button className='bg-red text-white text-base font-subHeading h-[42px] w-[192px] rounded-lg'>Lorem Ipsum</button> */}
                        </div>
                        <div className='mt-0 w-[100%] lg:w-[200%] flex gap-5 lg:gap-8 justify-between lg:justify-end mb-5 lg:mb-10 px-3 lg:px-0'>
                            <div className='w-full h-full bg-cover bg-center'>
                            <img src="/images/aboutUs1.png" className='w-full h-full' alt="Hero Image 1" />
                            </div>
                            <div className='w-full h-full bg-cover bg-center'>
                            <img src="/images/aboutUs2.png" className='w-full h-full' alt="Hero Image 2" />
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <OurGlobalPresence />
                <Footer />
            {/* </div> */}
        </div>
        
            
    );
};

export default ContactUs;
