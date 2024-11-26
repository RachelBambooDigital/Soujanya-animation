import React from 'react';

const Loader = () => {
  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center px-8 sm:px-10 md:px-12 lg:px-20">
        {/* Logo */}
        <img
            src="/logos/NavLogoWhite.svg"
            alt="Loading Logo"
            className="h-10 sm:h-12 md:h-16 lg:h-20"
        />
        <div className="relative mt-6 w-full max-w-4xl">
            {/* Horizontal Progress Bar with Rounded Edges */}
            <svg className="h-4 sm:h-6 md:h-8 lg:h-10 w-full" viewBox="0 0 100 10">
                {/* Background Rectangle */}
                <rect
                    x="0"
                    y="0"
                    width="100"
                    height="2"
                    fill="#d1d5db" // Light gray background color
                    rx="3" // Rounded corners
                    ry="3" // Rounded corners
                />
                {/* Filling Rectangle (animated) */}
                <rect
                    x="0"
                    y="0"
                    width="0"
                    height="2"
                    fill="#4a5568" // Darker color for the progress bar
                    rx="3" // Rounded corners
                    ry="3" // Rounded corners
                    className="animate-fill"
                />
            </svg>
            {/* Loading text (optional) */}
            {/* <p className="text-white mt-2 text-center">Loading...</p> */}
        </div>
    </div>
  );
};

export default Loader;
