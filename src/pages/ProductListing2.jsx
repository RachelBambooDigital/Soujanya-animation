import OurGlobalPresence from "@/sections/OurGlobalPresence";
import ProductListingCards2 from '@/sections/ProductListingCards2';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ProductListing2 = () => {
  const [categories, setCategories] = useState([]); // Initialize categories state
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/shopify/fetchProductCategories`, { method: 'POST' });
          const data = await response.json();
  
          if (!Array.isArray(data)) {
              throw new Error("Invalid data format");
          }
  
          const formattedCategories = data.map(edge => {
              const fields = edge.node.fields;
              const categoryName = fields.find(field => field.key === 'category_name_2')?.value;
              const products = fields.find(field => field.key === 'products_2')?.references?.edges.map(productEdge => productEdge.node) || [];
  
              return { categoryName, products };
          });
  
          setCategories(formattedCategories);
          
      } catch (error) {
          console.error('Error fetching categories:', error);
      }
    };  

    fetchCategories();
  }, []);

  return (
    <div className='w-full bg-cover bg-center bg-white relative' style={{ backgroundImage: `url("/pipe.png")` }}>
      <div className='h-[50vh] sm:h-[50vh] md:h-[60vh] lg:h-[80dvh] w-full bg-cover bg-center relative'>
        <img 
          src="/images/productListing.png" 
          className='hidden sm:hidden md:block w-full h-[65dvh] object-cover' 
          alt="Large Image"
        />
        <img 
          src="/images/productListingSmall.png" 
          className='block sm:block md:hidden w-full h-full object-cover' 
          alt="Small Image"
        />

        <div className='absolute inset-3 flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-center text-white font-medium p-5 xl:p-10 -mb-40 sm:-mb-44 md:-mb-64 lg:-mb-16'>
          <p className="text-[12px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-normal">Industrial Applications</p>
          <h1 className='w-full md:w-[500px] lg:w-[650px] text-[40px] sm:text-[32px] md:text-[40px] lg:text-[56px] leading-[45px] sm:leading-10 md:leading-10 lg:leading-[65px] font-heading'>
            Life <br /> Sciences
          </h1>
        </div>
      </div>
      
      <div>
        {categories.map((category, index) => {
          console.log("Products for category:", category.categoryName, category.products); 
          return(
            <div key={index}>
              {/* <h2>{category.categoryName}</h2> */}
              <ProductListingCards2 products={category.products} />
          </div>
          );
          
        })};
      </div>
      <OurGlobalPresence />
    </div>
  );
};

export default ProductListing2;
