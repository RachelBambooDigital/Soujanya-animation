import LifeSciencesAPIProductsCard from "@/components/LifeSciencesAPIProductsCard";

const IntermediateProducts = ({
  applicationTitle,
  applicationDesc,
  product1Title,
  product1Empirical,
  product1Cas,
  product1Molecular,
  product1Desc,

  product2Title,
  product2Empirical,
  product2Cas,
  product2Molecular,
  product2Desc,

  product3Title,
  product3Empirical,
  product3Cas,
  product3Molecular,
  product3Desc,

  product4Title,
  product4Empirical,
  product4Cas,
  product4Molecular,
  product4Desc,  

  product5Title,
  product5Empirical,
  product5Cas,
  product5Molecular,
  product5Desc,

  product6Title,
  product6Empirical,
  product6Cas,
  product6Molecular,
  product6Desc,

  product7Title,
  product7Empirical,
  product7Cas,
  product7Molecular,
  product7Desc,

}) => {
  return (
    <div className="w-full bg-white">
      <div className="w-full flex flex-col bg-white px-5 lg:px-10">
        <div className="w-full flex flex-col lg:flex-row justify-start lg:gap-[300px] py-[60px] lg:py-[80px]">
          <p className="font-subHeading text-black font-medium text-[14px] lg:text-[18px] mb-10">
            {applicationTitle} {/* Correctly rendering string */}
          </p>
          <h3 className="font-subHeading text-[24px] leading-8 lg:text-[18px] lg:leading-[26px] lg:w-[600px] mb-5">
            {applicationDesc} {/* Correctly rendering string */}
          </h3>
        </div>

        <div
          id="life-sciences-api-products"
          className="w-full h-fit items-center justify-start gap-x-10 flex flex-row flex-wrap mb-10 lg:mb-20"
        >
          {/* Example of rendering a specific product card */}
          <LifeSciencesAPIProductsCard
            title={product1Title} // Correctly passing string
            description={product1Desc} // Correctly passing string
            EmpiricalFormula={product1Empirical} // Correctly passing string
            CASNumber={product1Cas} // Correctly passing string
            MolecularWeight={product1Molecular} // Correctly passing string
          />
          <LifeSciencesAPIProductsCard
            title={product2Title} // Correctly passing string
            description={product2Desc} // Correctly passing string
            EmpiricalFormula={product2Empirical} // Correctly passing string
            CASNumber={product2Cas} // Correctly passing string
            MolecularWeight={product2Molecular} // Correctly passing string
          />
          <LifeSciencesAPIProductsCard
            title={product3Title} // Correctly passing string
            description={product3Desc} // Correctly passing string
            EmpiricalFormula={product3Empirical} // Correctly passing string
            CASNumber={product3Cas} // Correctly passing string
            MolecularWeight={product3Molecular} // Correctly passing string
          />
          <LifeSciencesAPIProductsCard
            title={product4Title} // Correctly passing string
            description={product4Desc} // Correctly passing string
            EmpiricalFormula={product4Empirical} // Correctly passing string
            CASNumber={product4Cas} // Correctly passing string
            MolecularWeight={product4Molecular} // Correctly passing string
          />
          <LifeSciencesAPIProductsCard
            title={product5Title} // Correctly passing string
            description={product5Desc} // Correctly passing string
            EmpiricalFormula={product5Empirical} // Correctly passing string
            CASNumber={product5Cas} // Correctly passing string
            MolecularWeight={product5Molecular} // Correctly passing string
          />
          <LifeSciencesAPIProductsCard
            title={product6Title} // Correctly passing string
            description={product6Desc} // Correctly passing string
            EmpiricalFormula={product6Empirical} // Correctly passing string
            CASNumber={product6Cas} // Correctly passing string
            MolecularWeight={product6Molecular} // Correctly passing string
          />
          <LifeSciencesAPIProductsCard
            title={product7Title} // Correctly passing string
            description={product7Desc} // Correctly passing string
            EmpiricalFormula={product7Empirical} // Correctly passing string
            CASNumber={product7Cas} // Correctly passing string
            MolecularWeight={product7Molecular} // Correctly passing string
          />
          {/* Add more product cards if necessary */}
        </div>
      </div>
    </div>
  );
};

export default IntermediateProducts;
