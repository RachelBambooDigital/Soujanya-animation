import React from 'react';
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from 'react-router-dom';

const ProductListingCards2 = ({ products, language }) => {
    const getUrlPath = (productId) => {
        // Extract the last part of the Shopify ID
        const id = productId.split('/').pop();
        
        // Map specific product IDs to URLs
        const urlMap = {
            '7376925884482': '/active-pharmaceutical-ingredients',
            '7377107648578': '/emollients',
            '7377107451970': '/intermediate'
        };
        
        return urlMap[id] || '/';
    };

    if (!products || products.length === 0) {
        return <div>No products available</div>;
    }

    return (
        <div className="w-full mt-32">
            <div className="w-full flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-16 px-5 lg:px-10">
                <div className="flex justify-center -mt-24 sm:-mt-28 md:-mt-16 lg:-mt-48">
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <div key={product.id || index} className="flex justify-center">
                                <div className="flex flex-col justify-between gap-2 p-4 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full sm:w-[300px] md:w-[350px] lg:w-[370px]">
                                    {product.featuredImage?.url && (
                                        <img
                                            src={product.featuredImage.url}
                                            className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] object-cover bg-center rounded-md mb-4"
                                            alt={product.title || 'Product image'}
                                        />
                                    )}
                                    <h1 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[18px] font-medium leading-6 sm:leading-8 lg:leading-[30px]">
                                        {product.title}
                                    </h1>
                                    <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[14px] leading-5 lg:leading-[26px] mb-4 text-[#667085]">
                                        {product.description}
                                    </p>
                                    <Link to={getUrlPath(product.id)}>
                                        <button className="w-full flex items-center justify-center gap-2 sm:gap-3 mt-1 rounded-lg border border-black hover:border-opacity-0 py-2 text-[14px] sm:text-[16px] lg:text-[16px] font-normal hover:bg-red hover:text-white transition-all duration-300">
                                            {language === 'en' ? 'See Product' : product.seeProductText}
                                            <HiOutlineArrowNarrowRight />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListingCards2;