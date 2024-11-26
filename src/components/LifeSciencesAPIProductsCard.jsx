import PropTypes from "prop-types";

const LifeSciencesAPIProductsCard = ({ title, description,EmpiricalFormula,CASNumber, MolecularWeight }) => {
  return (
    <div className="w-full lg:w-[644px] h-[350px] lg:h-[350px] ">
      {/* Product Title */}
      <h2 className="text-[24px] lg:text-[32px] font-heading mb-4 lg:ml-6">{title}</h2>

      {/* Horizontal Line */}
      <hr className="border-t border-[#727272] mb-4" />

      {/* Product Description */}
      <div className="flex flex-col text-[18px] leading-[26px] font-subHeading lg:ml-6 mb-4">
        <div className="flex">
          <p className="font-semibold w-[160px]">Empirical Formula: </p>
          <span className="font-normal text-gray-600">{EmpiricalFormula}</span>
        </div>
        <div className="flex">
          <p className="font-semibold w-[160px]">CAS Number: </p>
          <span className="font-normal text-gray-600">{CASNumber}</span>
        </div>
        <div className="flex">
          <p className="font-semibold w-[160px]">Molecular Weight: </p>
          <span className="font-normal text-gray-600">{MolecularWeight}</span>
        </div>
      </div>
      <p className="text-[18px] leading-[26px] font-subHeading text-gray-600 lg:ml-6 w-full lg:w-[400px] text-[#667085]">{description}</p>
    </div>
  );
};

// Define prop types for the component
LifeSciencesAPIProductsCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default LifeSciencesAPIProductsCard;
