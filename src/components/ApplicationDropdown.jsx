import React, { useEffect,  useRef } from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { MdKeyboardArrowDown,MdKeyboardArrowUp } from "react-icons/md";

const ApplicationDropdown = ({color}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); // To track the dropdown reference

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close the dropdown if clicking outside the component
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className=""ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className={`flex items-center text-xs text-${color} font-semibold py-2 px-6  h-full`}
            >
                Applications
                {isOpen ? (
                    <MdKeyboardArrowUp className={`ml-3 text-${color}`} />
                ) : (
                    <MdKeyboardArrowDown className={`ml-3 text-${color}`} />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-14 left-0 w-full bg-white rounded-md shadow-xl">
                    <div className="w-full h-full cursor-pointer text-xs flex flex-col font-subHeading">
                        <p className=' w-full font-medium py-2 text-center hover:bg-red hover:text-white rounded-t-md'>Rubber And Plastic</p>
                        <p className=' w-full font-medium py-2 text-center hover:bg-red hover:text-white'>Inks</p>
                        <p className=' w-full font-medium py-2 text-center hover:bg-red hover:text-white'>Composites</p>
                        <p className=' w-full font-medium py-2 text-center hover:bg-red hover:text-white'>Wood</p>
                        <p className=' w-full font-medium py-2 text-center hover:bg-red hover:text-white'>Transport</p>
                        <p className=' w-full font-medium py-2 text-center hover:bg-red hover:text-white'>Personal care</p>
                        <p className=' w-full font-medium py-2 text-center hover:bg-red hover:text-white rounded-b-md'>Flooring</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ApplicationDropdown