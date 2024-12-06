import { globalPresence } from "@/lib/images";

const OurGlobalPresence = () => {
  return (
    <div className="w-full h-screen">
      <div className="w-full left-0 bg-opacity-10 backdrop-blur-lg bg-white relative h-full">
        <div className="w-full flex flex-col lg:flex-row justify-between h-full px-5 sm:px-8 md:px-10">
          <div className="flex flex-col justify-between gap-10 md:gap-16 lg:gap-0 w-full lg:w-2/3">
            {/* Global Presence Header */}
            <div className="w-full flex flex-col items-start">
              <p className="py-3 sm:py-5 lg:py-10 font-subHeading font-medium text-[18px] sm:text-[20px] md:text-[22px]">
                Our Global Presence
              </p>
              <h1 className="font-heading text-[28px] lg:text-[54px] leading-8 sm:leading-10 md:leading-[60px] lg:leading-[70px]">
                We are available <br />
                Worldwide
              </h1>
            </div>

            {/* Locations Grid */}
            <div className="w-full flex flex-col lg:flex-row justify-between mb-5 lg:mb-10">
              <div className="locations grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-2 lg:gap-16">
                {/* <div className="location w-full flex lg:flex-row lg:justify-start"> */}
                {/* India */}
                <div className="address flex flex-col gap-2 lg:gap-4">
                  <h1 className="font-subHeading font-light text-[24px] sm:text-[28px] md:text-[32px] lg:text-[52px]">
                    India
                  </h1>
                  <div className="font-subHeading text-[12px] sm:text-[14px] md:text-[16px] lg:text-base lg:leading-6 font-medium">
                    <div className="h-auto sm:h-[170px] lg:h-[180px]">
                      <p>Soujanya Color Pvt. Ltd.</p>
                      <p>C-35/36, TTC Industrial Area,</p>
                      <p>MIDC Pawne,</p>
                      <p>Navi Mumbai - 400 705,</p>
                      <p>Maharashtra, India</p>
                    </div>
                    <div>
                      <p>T: +91 22 6906 1234</p>
                      <p>T: +91 22 6906 1246</p>
                    </div>
                  </div>
                </div>

                {/* Brazil */}
                <div className="address flex flex-col gap-2 lg:gap-4">
                  <h1 className="font-subHeading font-light text-[24px] sm:text-[28px] md:text-[32px] lg:text-[52px]">
                    Brazil
                  </h1>
                  <div className="font-subHeading text-[12px] sm:text-[14px] md:text-[16px] lg:text-base lg:leading-6 font-medium">
                    <div className="h-auto sm:h-[120px] lg:h-[140px]">
                      <p>Soujanya Color Pvt. Ltd.</p>
                      <p>Sao Paulo, Sao Paulo,</p>
                      <p>Brazil</p>
                    </div>
                    <div>
                      <p>T: +55119 7288 1852</p>
                    </div>
                  </div>
                </div>

                {/* Mexico */}
                <div className="address flex flex-col gap-2 lg:gap-4">
                  <h1 className="font-subHeading font-light text-[24px] sm:text-[28px] md:text-[32px] lg:text-[52px]">
                    Mexico
                  </h1>
                  <div className="font-subHeading text-[12px] sm:text-[14px] md:text-[16px] lg:text-base lg:leading-6 font-medium">
                    <div className="h-auto sm:h-[120px] lg:h-[140px]">
                      <p>Soujanya Color Mexico S.A. de C.V.</p>
                      <p>Insurgentes Sur 1787 Col.</p>
                      <p>Guadalupe Inn. Alvaro</p>
                      <p>Obregon. Mexico City</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex lg:items-end pb-10 lg:w-1/3">
            <img
              src={globalPresence}
              alt="section-img"
              className="w-full lg:w-[412px] h-[500px] lg:h-[572px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurGlobalPresence;
