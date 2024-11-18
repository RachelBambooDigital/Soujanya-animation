import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';

const ProductsDropdown = ({color}) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="">
            <button
                onClick={toggleDropdown}
                className={`text-xs text-${color} font-light py-2 px-8 h-full`}
            >
                Browse By Products
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

export default ProductsDropdown