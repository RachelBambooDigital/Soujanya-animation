import LifeSciencesAPIProductsCard from "@/components/LifeSciencesAPIProductsCard";

const EmollientsProducts = ({
  applicationTitle,
  applicationDesc,
  product1Title,
  product1Empirical,
  product1Cas,
  product1Molecular,
  product1Desc
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
          className="w-full h-fit items-center justify-start gap-x-10 flex flex-row flex-wrap mb-10 lg:mb-0"
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
            title={product1Title} // Correctly passing string
            description={product1Desc} // Correctly passing string
            EmpiricalFormula={product1Empirical} // Correctly passing string
            CASNumber={product1Cas} // Correctly passing string
            MolecularWeight={product1Molecular} // Correctly passing string
          />
          <LifeSciencesAPIProductsCard
            title={product1Title} // Correctly passing string
            description={product1Desc} // Correctly passing string
            EmpiricalFormula={product1Empirical} // Correctly passing string
            CASNumber={product1Cas} // Correctly passing string
            MolecularWeight={product1Molecular} // Correctly passing string
          />
          {/* Add more product cards if necessary */}
        </div>
      </div>
    </div>
  );
};

export default EmollientsProducts;
