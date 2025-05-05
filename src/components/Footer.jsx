import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { apiBaseUrl } from "@/config";

const Footer = ({language}) => {
  const [metaFields, setMetaFields] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {

      const response = await axios.post(`${apiBaseUrl}/newsletter`, formData);
      if (response.status === 201) {
        toast.success("Form submitted successfully!");
        setFormData({ email: "" });
      } else {
        toast.error("Unexpected response status!");
      }
    } catch (error) {
      console.error("Error submitting the form", error);
      toast.error("There was an error submitting the form.");
    }
  };

  useEffect(() => {
    const fetchGlobalPresence = async () => {
      const query = `query {
        metaobjects(type: "footer", first: 50) {
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
  
    fetchGlobalPresence();
  }, [language]); 

  if (!metaFields) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <footer
      id="footer"
      className="w-full px-5 lg:px-10 h-screen bg-black flex flex-col justify-between overflow-y-hidden"
    >
      <Toaster position="bottom-right" /> {/* Toast notification container */}
      <div className="foot-note relative w-full h-full">
        <p
          className="absolute top-0 left-0 text-white font-subHeading hover:underline cursor-pointer mt-[40px] lg:mt-[72px] ml-5 lg:ml-10"
          onClick={scrollToTop}
        >
          {metaFields.back_to_top_text}
        </p>

        <div className="flex flex-col items-start justify-center text-left w-full h-full lg:w-[800px] mx-auto">
          <h1 className="font-subHeading text-white text-[40px] leading-[45px] tracking-[-3%] font-light lg:text-[52px] lg:leading-[60px]">
            {metaFields.footer_desc}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="inputs flex flex-col lg:flex-row gap-4 mt-6 font-subHeading font-normal">
              <div>
                <input
                  type="text"
                  name="email"
                  placeholder={metaFields.email_field}
                  className="w-full lg:w-[320px] p-5 h-[42px] text-white text-[14px] rounded-md bg-[#292929] border-2 border-[#576275] focus-visible:border-y-white"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <br />
                {errors.email && <span className="text-red">{errors.email}</span>}
              </div>

              <button
                type="submit"
                className="w-full lg:w-[100px] h-[42px] rounded-md bg-red text-white text-[14px] hover:underline"
              >
                {metaFields.button_text}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="footer-links max-w-screen-2xl mx-auto w-full flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-20 mb-8 px-5 lg:px-10">
        <Link
          to="/"
          className="flex justify-center lg:justify-start mb-4 lg:mb-0 w-full lg:w-auto"
        >
          <img
            src="/logos/navLogo.png"
            alt="soujanya-logo"
            className="w-[200px]"
          />
        </Link>

        <nav className="text-white flex flex-row gap-6 lg:gap-10 text-[0.8rem] sm:text-[0.8rem] md:text-[1rem] lg:text-[1rem] w-full lg:w-auto justify-center items-center text-center">
          <Link to="/about-us" className="mr-1">
            {metaFields.aboutus_link_text}
          </Link>
          <Link to="/home-care-cosmetics">{metaFields.homecare_link_text}</Link>
          <Link to="/coatings-inks">Coatings & Inks</Link>
          <Link to="/life-sciences">{metaFields.lifesciences_link_text}</Link>
          <Link to="/career">Careers</Link>
        </nav>

        <p className="text-white text-center lg:text-left lg:mt-0 w-full lg:w-auto text-[0.8rem] sm:text-[0.8rem] md:text-[1rem] lg:text-[1.1rem]">
          {metaFields.rights_reserved_text}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
