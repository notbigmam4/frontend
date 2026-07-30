import React from 'react';

const NUMBER_OF_CIRCLES = 6;
const RING_OPACITIES = [1, 1, 0.5, 1 / 3, 0.25, 0.2];

const OvalCircles: React.FC = () => {
    return (
        <>
            {Array.from({ length: NUMBER_OF_CIRCLES }).map((_, index) => (
                <div
                    key={index}
                    className="absolute left-0 h-12 w-12 scale-x-150 rounded-full border border-[#f8c87f]"
                    style={{
                        top: `${index * 10}px`,
                        opacity: RING_OPACITIES[index],
                    }}
                />
            ))}
        </>
    );
};

export default OvalCircles;
