import React, { useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../config";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    const scrollContainer = document.querySelector('.custom-scroll'); // Target the correct scrollable container
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth' // Enable smooth scrolling
      });
    }
  };

  // State to store form data
  const [formData, setFormData] = useState({
    email: ""
  });

  // State to store errors
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
    });
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!formData.email.trim()) {
        newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    try {
        const response = await axios.post(`${ apiBaseUrl }/newsletter`, formData);
        if (response.status === 201) {
            alert("Form submitted successfully!");
        }
    } catch (error) {
        console.error("Error submitting the form", error);
        alert("There was an error submitting the form.");
    }
  };

  return (
    <footer id="footer" className="w-full px-5 lg:px-10 h-screen bg-black flex flex-col justify-between overflow-y-hidden">
      <div className="foot-note flex lg:flex-row flex-col w-full justify-start gap-[30px] lg:gap-[470px] mt-[40px] lg:mt-[72px]">
        <p className="text-white font-subHeading hover:underline cursor-pointer"
          onClick={scrollToTop}>
          Back to top
        </p>
        <div className="flex flex-col">
          <h1 className="font-subHeading text-white text-[40px] leading-[45px] tracking-[-3%] font-light lg:text-[52px] lg:w-[600px] lg:leading-[60px] w-600px">
            Be the first to know about our events and product updates.
            <span className="font-heading text-red"> #nospam</span>
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="inputs flex flex-col lg:flex-row gap-4 mt-6 font-subHeading font-normal">
              <div>
                <input 
                  type="text"
                  name="email"
                  placeholder="Email"
                  className="w-full lg:w-[320px] p-5 h-[42px] text-white text-[14px] rounded-md bg-[#292929] border-2 border-[#576275] focus-visible:border-y-white"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                /> <br />
                {errors.email && <span className="text-red">{errors.email}</span>}
              </div>

              <button type="submit" className="w-full lg:w-[100px] h-[42px] rounded-md bg-red text-white text-[14px] hover:underline">
                OK
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="footer-links max-w-screen-xl mx-auto w-full flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-20 mb-8 px-5 lg:px-10">
        {/* Logo Section - Left Aligned */}
        <Link to="/" className="flex justify-center lg:justify-start mb-4 lg:mb-0 w-full lg:w-auto">
            <img src="/logos/navLogo.png" alt="soujanya-logo" className="w-[180px] lg:w-[200px]" />
        </Link>

        {/* Navigation Links - Center Aligned */}
        <nav className="text-white flex flex-row gap-6 lg:gap-10 text-[0.8rem] sm:text-[0.8rem] md:text-[1rem] lg:text-[1.1rem] w-full lg:w-auto justify-center items-center text-center">
            <Link to="/about-us" className="mr-1">
                About Us
            </Link>
            <Link to="/home-care-cosmetics" className="">
                Home, Personal Care & Cosmetics
            </Link>
            <Link to="/life-sciences" className="">
                Life Sciences
            </Link>
        </nav>

        {/* Rights Text - Center Aligned */}
        <p className="text-white text-center lg:text-left lg:mt-0 w-full lg:w-auto text-[0.8rem] sm:text-[0.8rem] md:text-[1rem] lg:text-[1.1rem]">
            All rights reserved
        </p>
      </div>

    </footer>
  );
};

export default Footer;
