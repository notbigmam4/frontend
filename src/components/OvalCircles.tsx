import React from 'react';
import { motion, type MotionValue, useTransform } from 'framer-motion';

const NUMBER_OF_CIRCLES = 6;
const RING_SPACING = 10;
const RING_CYCLE = NUMBER_OF_CIRCLES * RING_SPACING;
const RING_OPACITIES = [1, 1, 0.5, 1 / 3, 0.25, 0.2];

type OvalCirclesProps = {
    letterY: MotionValue<number>;
};

type RingProps = OvalCirclesProps & {
    index: number;
};

const wrapRingPosition = (position: number) =>
    ((position % RING_CYCLE) + RING_CYCLE) % RING_CYCLE;

const getRingOpacity = (position: number) => {
    if (position >= (NUMBER_OF_CIRCLES - 1) * RING_SPACING) {
        return RING_OPACITIES[NUMBER_OF_CIRCLES - 1];
    }

    const lowerIndex = Math.floor(position / RING_SPACING);
    const upperIndex = Math.min(lowerIndex + 1, NUMBER_OF_CIRCLES - 1);
    const progress = position / RING_SPACING - lowerIndex;

    return (
        RING_OPACITIES[lowerIndex] +
        progress *
            (RING_OPACITIES[upperIndex] - RING_OPACITIES[lowerIndex])
    );
};

const Ring: React.FC<RingProps> = ({ index, letterY }) => {
    const top = useTransform(letterY, (currentY) =>
        wrapRingPosition(index * RING_SPACING - currentY + RING_SPACING),
    );
    const opacity = useTransform(top, getRingOpacity);

    return (
        <motion.div
            className="absolute left-0 top-0 h-[52px] w-[52px]"
            style={{ opacity, y: top }}
        >
            <div className="h-full w-full scale-x-150 rounded-full border border-[#f8c87f]" />
        </motion.div>
    );
};

const OvalCircles: React.FC<OvalCirclesProps> = ({ letterY }) => {
    return (
        <>
            {Array.from({ length: NUMBER_OF_CIRCLES }).map((_, index) => (
                <Ring
                    key={index}
                    index={index}
                    letterY={letterY}
                />
            ))}
        </>
    );
};

export default OvalCircles;
