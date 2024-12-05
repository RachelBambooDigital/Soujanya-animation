import React from 'react';

const BlogDetail = () => {
    return (
        <article className="max-w-7xl mx-auto px-4 pt-24 sm:pt-24 md:pt-32 lg:pt-36">
        {/* Main Content Area */}
        <div className="relative flex flex-col md:block">
            {/* Left Content */}
            <div className="w-full md:w-[50%]">
                <div className="space-y-6">
                <p className="text-black font-subHeading">Lorem ipsum</p>
                
                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-navyBlue">
                    Infusing vibrant color for a lasting impact in glass
                </h1>
                
                {/* Author and Meta */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                    <img 
                        src="/images/blogUser.png" 
                        alt="Author avatar" 
                        className="w-10 h-10 rounded-full"
                    />
                    <span className="font-subHeading">Luis Buñuel</span>
                    </div>
                </div>
                </div>
            </div>

            {/* Image - Responsive positioning */}
            <div className="w-full mt-8 mb-4 md:mb-0 md:absolute md:top-[-5rem] md:right-[-1rem] md:w-[45%]">
                <img
                src="/images/blog1.png"
                alt="Featured image"
                className="w-full h-full object-cover rounded-2xl md:rounded-none"
                />
            </div>

            {/* Meta info for mobile - Shown below image */}
            <div className="flex items-center gap-6 text-sm text-black font-subHeading md:hidden">
                <div className="flex items-center gap-2">
                <svg width="25" height="19" viewBox="0 0 37 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M33.1484 30.1452H3.85677C2.154 30.1452 0.773438 28.7646 0.773438 27.0618V3.93685C0.773438 2.23408 2.154 0.853516 3.85677 0.853516H33.1484C34.8512 0.853516 36.2318 2.23408 36.2318 3.93685V27.0618C36.2318 28.7646 34.8512 30.1452 33.1484 30.1452ZM34.6901 3.93685C34.6901 3.08585 33.9994 2.39518 33.1484 2.39518H3.85677C3.00577 2.39518 2.3151 3.08585 2.3151 3.93685V8.56185H34.6901V3.93685ZM34.6901 10.1035H2.3151V27.0618C2.3151 27.9128 3.00577 28.6035 3.85677 28.6035H33.1484C33.9994 28.6035 34.6901 27.9128 34.6901 27.0618V10.1035ZM31.6068 20.8952H30.0651C29.6396 20.8952 29.2943 20.5506 29.2943 20.1243V18.5827C29.2943 18.1572 29.6396 17.8118 30.0651 17.8118H31.6068C32.033 17.8118 32.3776 18.1572 32.3776 18.5827V20.1243C32.3776 20.5506 32.033 20.8952 31.6068 20.8952ZM31.6068 15.4993H30.0651C29.6396 15.4993 29.2943 15.1548 29.2943 14.7285V13.1868C29.2943 12.7606 29.6396 12.416 30.0651 12.416H31.6068C32.033 12.416 32.3776 12.7606 32.3776 13.1868V14.7285C32.3776 15.1548 32.033 15.4993 31.6068 15.4993ZM25.4401 20.8952H23.8984C23.4729 20.8952 23.1276 20.5506 23.1276 20.1243V18.5827C23.1276 18.1572 23.4729 17.8118 23.8984 17.8118H25.4401C25.8664 17.8118 26.2109 18.1572 26.2109 18.5827V20.1243C26.2109 20.5506 25.8664 20.8952 25.4401 20.8952ZM25.4401 15.4993H23.8984C23.4729 15.4993 23.1276 15.1548 23.1276 14.7285V13.1868C23.1276 12.7606 23.4729 12.416 23.8984 12.416H25.4401C25.8664 12.416 26.2109 12.7606 26.2109 13.1868V14.7285C26.2109 15.1548 25.8664 15.4993 25.4401 15.4993ZM19.2734 20.8952H17.7318C17.3055 20.8952 16.9609 20.5506 16.9609 20.1243V18.5827C16.9609 18.1572 17.3055 17.8118 17.7318 17.8118H19.2734C19.6997 17.8118 20.0443 18.1572 20.0443 18.5827V20.1243C20.0443 20.5506 19.6997 20.8952 19.2734 20.8952ZM19.2734 15.4993H17.7318C17.3055 15.4993 16.9609 15.1548 16.9609 14.7285V13.1868C16.9609 12.7606 17.3055 12.416 17.7318 12.416H19.2734C19.6997 12.416 20.0443 12.7606 20.0443 13.1868V14.7285C20.0443 15.1548 19.6997 15.4993 19.2734 15.4993ZM13.1068 26.291H11.5651C11.1388 26.291 10.7943 25.9465 10.7943 25.5202V23.9785C10.7943 23.5522 11.1388 23.2077 11.5651 23.2077H13.1068C13.533 23.2077 13.8776 23.5522 13.8776 23.9785V25.5202C13.8776 25.9465 13.533 26.291 13.1068 26.291ZM13.1068 20.8952H11.5651C11.1388 20.8952 10.7943 20.5506 10.7943 20.1243V18.5827C10.7943 18.1572 11.1388 17.8118 11.5651 17.8118H13.1068C13.533 17.8118 13.8776 18.1572 13.8776 18.5827V20.1243C13.8776 20.5506 13.533 20.8952 13.1068 20.8952ZM13.1068 15.4993H11.5651C11.1388 15.4993 10.7943 15.1548 10.7943 14.7285V13.1868C10.7943 12.7606 11.1388 12.416 11.5651 12.416H13.1068C13.533 12.416 13.8776 12.7606 13.8776 13.1868V14.7285C13.8776 15.1548 13.533 15.4993 13.1068 15.4993ZM6.9401 26.291H5.39844C4.97217 26.291 4.6276 25.9465 4.6276 25.5202V23.9785C4.6276 23.5522 4.97217 23.2077 5.39844 23.2077H6.9401C7.36637 23.2077 7.71094 23.5522 7.71094 23.9785V25.5202C7.71094 25.9465 7.36637 26.291 6.9401 26.291ZM6.9401 20.8952H5.39844C4.97217 20.8952 4.6276 20.5506 4.6276 20.1243V18.5827C4.6276 18.1572 4.97217 17.8118 5.39844 17.8118H6.9401C7.36637 17.8118 7.71094 18.1572 7.71094 18.5827V20.1243C7.71094 20.5506 7.36637 20.8952 6.9401 20.8952ZM17.7318 23.2077H19.2734C19.6997 23.2077 20.0443 23.5522 20.0443 23.9785V25.5202C20.0443 25.9465 19.6997 26.291 19.2734 26.291H17.7318C17.3055 26.291 16.9609 25.9465 16.9609 25.5202V23.9785C16.9609 23.5522 17.3055 23.2077 17.7318 23.2077Z" fill="black"/>
                </svg>

                24 September 2024
                </div>
                <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="7.5" stroke="currentColor"/>
                    <path d="M10 5.83337V10L12.5 12.5" stroke="currentColor"/>
                </svg>
                4 mins
                </div>
            </div>

            {/* Meta info for desktop - Shown with author */}
            {/* <div className="hidden md:flex items-center gap-6 text-sm text-navyBlue/60 font-subHeading"> */}
            <div className="hidden md:flex items-center gap-6 text-sm text-black font-subHeading mt-12">
                <div className="flex items-center gap-2">
                <svg width="25" height="19" viewBox="0 0 37 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M33.1484 30.1452H3.85677C2.154 30.1452 0.773438 28.7646 0.773438 27.0618V3.93685C0.773438 2.23408 2.154 0.853516 3.85677 0.853516H33.1484C34.8512 0.853516 36.2318 2.23408 36.2318 3.93685V27.0618C36.2318 28.7646 34.8512 30.1452 33.1484 30.1452ZM34.6901 3.93685C34.6901 3.08585 33.9994 2.39518 33.1484 2.39518H3.85677C3.00577 2.39518 2.3151 3.08585 2.3151 3.93685V8.56185H34.6901V3.93685ZM34.6901 10.1035H2.3151V27.0618C2.3151 27.9128 3.00577 28.6035 3.85677 28.6035H33.1484C33.9994 28.6035 34.6901 27.9128 34.6901 27.0618V10.1035ZM31.6068 20.8952H30.0651C29.6396 20.8952 29.2943 20.5506 29.2943 20.1243V18.5827C29.2943 18.1572 29.6396 17.8118 30.0651 17.8118H31.6068C32.033 17.8118 32.3776 18.1572 32.3776 18.5827V20.1243C32.3776 20.5506 32.033 20.8952 31.6068 20.8952ZM31.6068 15.4993H30.0651C29.6396 15.4993 29.2943 15.1548 29.2943 14.7285V13.1868C29.2943 12.7606 29.6396 12.416 30.0651 12.416H31.6068C32.033 12.416 32.3776 12.7606 32.3776 13.1868V14.7285C32.3776 15.1548 32.033 15.4993 31.6068 15.4993ZM25.4401 20.8952H23.8984C23.4729 20.8952 23.1276 20.5506 23.1276 20.1243V18.5827C23.1276 18.1572 23.4729 17.8118 23.8984 17.8118H25.4401C25.8664 17.8118 26.2109 18.1572 26.2109 18.5827V20.1243C26.2109 20.5506 25.8664 20.8952 25.4401 20.8952ZM25.4401 15.4993H23.8984C23.4729 15.4993 23.1276 15.1548 23.1276 14.7285V13.1868C23.1276 12.7606 23.4729 12.416 23.8984 12.416H25.4401C25.8664 12.416 26.2109 12.7606 26.2109 13.1868V14.7285C26.2109 15.1548 25.8664 15.4993 25.4401 15.4993ZM19.2734 20.8952H17.7318C17.3055 20.8952 16.9609 20.5506 16.9609 20.1243V18.5827C16.9609 18.1572 17.3055 17.8118 17.7318 17.8118H19.2734C19.6997 17.8118 20.0443 18.1572 20.0443 18.5827V20.1243C20.0443 20.5506 19.6997 20.8952 19.2734 20.8952ZM19.2734 15.4993H17.7318C17.3055 15.4993 16.9609 15.1548 16.9609 14.7285V13.1868C16.9609 12.7606 17.3055 12.416 17.7318 12.416H19.2734C19.6997 12.416 20.0443 12.7606 20.0443 13.1868V14.7285C20.0443 15.1548 19.6997 15.4993 19.2734 15.4993ZM13.1068 26.291H11.5651C11.1388 26.291 10.7943 25.9465 10.7943 25.5202V23.9785C10.7943 23.5522 11.1388 23.2077 11.5651 23.2077H13.1068C13.533 23.2077 13.8776 23.5522 13.8776 23.9785V25.5202C13.8776 25.9465 13.533 26.291 13.1068 26.291ZM13.1068 20.8952H11.5651C11.1388 20.8952 10.7943 20.5506 10.7943 20.1243V18.5827C10.7943 18.1572 11.1388 17.8118 11.5651 17.8118H13.1068C13.533 17.8118 13.8776 18.1572 13.8776 18.5827V20.1243C13.8776 20.5506 13.533 20.8952 13.1068 20.8952ZM13.1068 15.4993H11.5651C11.1388 15.4993 10.7943 15.1548 10.7943 14.7285V13.1868C10.7943 12.7606 11.1388 12.416 11.5651 12.416H13.1068C13.533 12.416 13.8776 12.7606 13.8776 13.1868V14.7285C13.8776 15.1548 13.533 15.4993 13.1068 15.4993ZM6.9401 26.291H5.39844C4.97217 26.291 4.6276 25.9465 4.6276 25.5202V23.9785C4.6276 23.5522 4.97217 23.2077 5.39844 23.2077H6.9401C7.36637 23.2077 7.71094 23.5522 7.71094 23.9785V25.5202C7.71094 25.9465 7.36637 26.291 6.9401 26.291ZM6.9401 20.8952H5.39844C4.97217 20.8952 4.6276 20.5506 4.6276 20.1243V18.5827C4.6276 18.1572 4.97217 17.8118 5.39844 17.8118H6.9401C7.36637 17.8118 7.71094 18.1572 7.71094 18.5827V20.1243C7.71094 20.5506 7.36637 20.8952 6.9401 20.8952ZM17.7318 23.2077H19.2734C19.6997 23.2077 20.0443 23.5522 20.0443 23.9785V25.5202C20.0443 25.9465 19.6997 26.291 19.2734 26.291H17.7318C17.3055 26.291 16.9609 25.9465 16.9609 25.5202V23.9785C16.9609 23.5522 17.3055 23.2077 17.7318 23.2077Z" fill="black"/>
                </svg>
                    24 September 2024
                </div>
                <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="7.5" stroke="currentColor"/>
                    <path d="M10 5.83337V10L12.5 12.5" stroke="currentColor"/>
                    </svg>
                    4 mins
                </div>
            </div>
            {/* </div> */}
        </div>

  
        {/* Horizontal Line - Width Matches Content */}
        <div className="lg:w-[55%] h-[1px] bg-navyBlue/10 my-12"></div>
  
        {/* Content Section */}
        <div className="sm:max-w-[50%] space-y-8 mt-[-1rem]">
          <p className="font-subHeading text-navyBlue/70 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
            fugiat nulla pariatur.
          </p>
  
          <h2 className="font-heading text-xl text-navyBlue/70">Lorem ipsum dolor sit amet</h2>
  
          <p className="font-subHeading text-navyBlue/70 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
  
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/blog1.png"
              alt="Process image 1"
              className="w-full aspect-[4/3] object-cover rounded-lg"
            />
            <img
              src="/images/blog3.png"
              alt="Process image 2"
              className="w-full aspect-[4/3] object-cover rounded-lg"
            />
          </div>
  
          <p className="font-subHeading text-navyBlue/70 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
  
          <h2 className="font-heading text-xl text-navyBlue/70">Lorem ipsum dolor sit amet</h2>
  
          <p className="font-subHeading text-navyBlue/70 leading-relaxed pb-12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </article>
  )
};
export default BlogDetail;