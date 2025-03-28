import React from 'react';

const OvalCircles: React.FC = () => {
    // Number of circles you want to create
    const numberOfCircles = 6;

    // Generate an array of circle elements
    const circles = Array.from({ length: numberOfCircles }).map((_, index) => (
        <div
            key={index}
            className="absolute w-12 h-12 scale-x-150 border-[#f8c87f] border rounded-full"
            style={{ top: `${index * 10}px`, opacity:1/index }} // Position each circle 30px apart (20px height + 10px gap)
        />
    ));

    return <>{circles}</>
};

export default OvalCircles;
