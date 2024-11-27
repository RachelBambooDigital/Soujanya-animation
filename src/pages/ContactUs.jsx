import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import OurGlobalPresence from "@/sections/OurGlobalPresence";
import Footer from "../components/Footer";
import { apiBaseUrl } from "@/config";

const ContactUs = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    message: "",
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid 10-digit phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/contact`, formData);

      if (response.status === 201) {
        // Display success toast
        toast.success("Form submitted successfully!");

        // Clear the form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          contactNumber: "",
          message: "",
        });

        // Clear errors
        setErrors({});
      }
    } catch (error) {
      console.error("Error submitting the form", error);
      toast.error("There was an error submitting the form.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div>
      <Toaster position="bottom-right" />
      <div className="w-full h-[1200px] lg:h-[880px] bg-cover bg-center bg-white relative py-20 ">
        <div className="hidden lg:flex inset-x-0 top-0 bg-[#FAF8F8] text-black text-sm items-center space-x-4 px-28 h-8">
          <span>Home</span>
          <span className="text-gray-400"> &gt; </span>
          <span>Contact us</span>
        </div>

        <div className="w-full flex h-full lg:h-[800px] relative bg-white">
          <div className="absolute inset-0 flex lg:flex-row flex-col-reverse gap-24 lg:justify-between w-full lg:w-auto items-end lg:items-center px-10 lg:px-10">
            <div className="flex flex-col gap-6 text-black font-medium md:px-12 lg:px-14">
              <h1 className="text-[28px] md:text-[32px] lg:text-[40px] font-subHeading text-black leading-[30px] md:leading-[40px] lg:leading-[45px]">
                Be the first to know about <br />
                our events and product updates.{" "}
                <span className="text-red">#nospam</span>
              </h1>
              <div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="flex flex-col md:flex-row md:space-x-4 gap-3">
                    <div className="w-full">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                      {errors.firstName && (
                        <span className="text-red text-sm">
                          {errors.firstName}
                        </span>
                      )}
                    </div>
                    <div className="w-full">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                      {errors.lastName && (
                        <span className="text-red text-sm">
                          {errors.lastName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:space-x-4 gap-3">
                    <div className="w-full">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {errors.email && (
                        <span className="text-red text-sm">{errors.email}</span>
                      )}
                    </div>

                    <div className="w-full">
                      <input
                        type="tel"
                        name="contactNumber"
                        placeholder="Contact Number"
                        className="w-full border border-gray-300 p-3 rounded-lg"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                      />
                      {errors.contactNumber && (
                        <span className="text-red text-sm">
                          {errors.contactNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <textarea
                      name="message"
                      placeholder="Message"
                      className="w-full border border-gray-300 p-3 rounded-lg"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                    {errors.message && (
                      <span className="text-red text-sm">{errors.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        name="privacyPolicyAccepted"
                        className="mt-1"
                        required
                      />
                      <label className="text-sm">
                        I accept the{" "}
                        <a href="#" className="underline">
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline">
                          Terms & Conditions
                        </a>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="bg-red text-white py-2 px-10 rounded-lg"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="w-[60%] lg:w-[35%]">
              <img src="/images/contactUs.png" alt="Contact Us" />
            </div>
          </div>
        </div>
      </div>
      <OurGlobalPresence />
      <Footer />
    </div>
  );
};

export default ContactUs;
