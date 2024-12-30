import React from 'react';
import { productListCards } from '../lib/contants';
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from 'react-router-dom';

const ProductListingCards = ({ products, language }) => {
    return (
        <div className="w-full mt-32">
            <div className="w-full flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-16 px-5 lg:px-10">
                {/* Cards Section */}
                <div className="flex justify-center -mt-24 sm:-mt-28 md:-mt-16 lg:-mt-48">
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* {productListCards.map((card, index) => ( */}
                        {products.map((product, index) => (
                            <div key={index} className="flex justify-center">
                                <div className="flex flex-col justify-between gap-2 p-4 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full sm:w-[300px] md:w-[350px] lg:w-[370px]">
                                    <img
                                        src={product.featuredImage?.url}
                                        className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] bg-cover bg-center rounded-md mb-4"
                                        alt={product.title}
                                    />
                                    <h1 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[18px] font-medium leading-6 sm:leading-8 lg:leading-[30px]">
                                        {product.title}
                                    </h1>
                                    <p className="text-[14px] sm:text-[16px] md:text-[16px] lg:text-[14px] leading-5 lg:leading-[26px] mb-4 text-[#667085]">
                                        {product.description}
                                    </p>
                                    <Link to={`/productDet/${product.id.replace('gid://shopify/Product/', '')}`}>
                                        <button className="w-full flex items-center justify-center gap-2 sm:gap-3 mt-1 rounded-lg border border-black hover:border-opacity-0 py-2 text-[14px] sm:text-[16px] lg:text-[16px] font-normal hover:bg-red hover:text-white transition-all duration-300">
                                        {language === 'en' ? 'See Product' : product.seeProductText}  <HiOutlineArrowNarrowRight />
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

export default ProductListingCards;
