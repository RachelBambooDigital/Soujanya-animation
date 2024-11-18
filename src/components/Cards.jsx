import React from 'react';

const Cards = ({ title, desc }) => {
    return (
        <div className='w-full lg:w-[550px] flex flex-col my-0 lg:my-10 p-4'>
            {/* Product Title */}
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-heading mb-4 lg:ml-6">
                {title}
            </h2>

            {/* Horizontal Line */}
            <hr className="border-t border-[#727272] mb-4" />

            {/* Product Description */}
            <p className="text-[15px] sm:text-[15px] lg:text-[16px] font-subHeading text-gray-600 lg:ml-6 leading-[20px] lg:leading-[26px] text-[#667085]">
                {desc}
            </p>
        </div>
    );
};

export default Cards;
