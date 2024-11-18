// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// const SearchResults = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   // Extract query parameter from the URL
//   const query = new URLSearchParams(location.search).get("query");

//   useEffect(() => {
//     if (query) {
//       const fetchProducts = async () => {
//         try {
//           const response = await fetch(
//             `/shopify/search?query=${encodeURIComponent(query)}`
//           );
//           const data = await response.json();
//           setProducts(data.products);
//           setLoading(false);
//         } catch (error) {
//           console.error("Error fetching search results:", error);
//           setLoading(false);
//         }
//       };
//       fetchProducts();
//     }
//   }, [query]);

//   return (
//     <div className="p-5">
//       <h2 className="text-xl mb-5">Search Results for "{query}"</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : products.length > 0 ? (
//         <div className="grid gap-4">
//           {products.map((product) => (
//             <div key={product.id} className="border p-4">
//               <h3>{product.title}</h3>
//               <img src={product.image.src} alt={product.title} />
//               <p>{product.description}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No products found for "{query}".</p>
//       )}
//     </div>
//   );
// };

// export default SearchResults;
