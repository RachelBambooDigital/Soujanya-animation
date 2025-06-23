import React, { useEffect, useState } from "react";
import ProductListingCards2 from "@/sections/ProductListingCards2";
import Footer from "@/components/Footer";
// import OurGlobalPresence from "@/sections/OurGlobalPresence";

const ProductListing2 = ({ language = "en" }) => {
  /* ────────────────────────────
     1. STATE
  ──────────────────────────── */
  const [categories, setCategories] = useState([]);
  const [pageContent, setPageContent] = useState({
    sectionTitle: "Industrial Applications",
    mainHeading: "Life Sciences",
  });

  /* ────────────────────────────
     2. DATA FETCHING
  ──────────────────────────── */
  useEffect(() => {
    /* Fetch category + product cards */
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/shopify/fetchProductCategories`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetLanguage: language }),
          }
        );
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid data");

        const formatted = data.map((edge) => {
          const fields = edge.node.fields;
          const products =
            fields
              .find((f) => f.key === "products_2")
              ?.references?.edges.map((e) => e.node) || [];
          return { products };
        });

        setCategories(formatted);
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };

    /* Translate static copy if needed */
    const fetchStaticCopy = async () => {
      if (language === "en") return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/shopify/translate-content`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: {
                sectionTitle: "Industrial Applications",
                mainHeading: "Life Sciences",
              },
              targetLanguage: language,
            }),
          }
        );
        const translated = await res.json();
        setPageContent(translated);
      } catch (err) {
        console.error("Translation fetch error:", err);
      }
    };

    fetchCategories();
    fetchStaticCopy();
  }, [language]);

  /* ────────────────────────────
     3. RENDER
  ──────────────────────────── */
  return (
    <div className="w-full relative min-h-screen bg-white">
      {/* ── HERO BANNER ───────────────────────── */}
      <div className="h-[50vh] md:h-[60vh] lg:h-[80dvh] relative w-full">
        {/* Desktop */}
        <img
          src="/images/productListing.png"
          alt="Product banner"
          className="hidden md:block w-full h-[65dvh] object-cover"
        />
        {/* Mobile */}
        <img
          src="/images/productListingSmall.png"
          alt="Product banner mobile"
          className="block md:hidden w-full h-full object-cover"
        />

        <div className="absolute inset-4 md:inset-6 lg:inset-10 flex flex-col justify-center gap-4 md:gap-5 lg:gap-6 text-white">
          <p className="text-xs md:text-sm lg:text-base font-normal">
            {pageContent.sectionTitle}
          </p>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-tight lg:leading-[65px] max-w-[650px]">
            {pageContent.mainHeading}
          </h1>
        </div>
      </div>

      {/* ── PRODUCT LIST GRID ─────────────────── */}
      <div className="bg-white">
        {categories.map((cat, idx) => (
          <div key={idx}>
            <ProductListingCards2 products={cat.products} language={language} />
          </div>
        ))}
      </div>

      {/* ── OPTIONAL GLOBAL PRESENCE ───────────── */}
      {/* <OurGlobalPresence language={language} /> */}

      {/* ── FOOTER ─────────────────────────────── */}
      {/* <Footer language={language} /> */}
    </div>
  );
};

export default ProductListing2;
