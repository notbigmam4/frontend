
import React from 'react';
import { motion } from 'framer-motion';
import OvalCircles from './OvalCircles';

const JumpingLetter: React.FC = () => {
    return (
        <div className=' w-fit h-[120px]'>
        
            <motion.div
                className=' text-[#969696] text-5xl font-semibold absolute top-[20px] left-[5px]'
                style={{  display: 'inline-block' }}
                animate={{
                    y: [
                        0, 
                        -Math.random() * 20, // Jump up
                        0, 
                        Math.random() * 20,  // Move down randomly
                        0                      // Back to the original position
                    ],
                }}
                transition={{
                    repeat: Infinity,
                    repeatType: 'mirror',
                    duration: 2, // Adjust the duration for speed of jumping
                    ease: 'easeInOut'
                }}
            >
                N
            </motion.div>
            <OvalCircles />
            {/* <div className='  border-yellow-500 border w-[80px] h-[40px] rounded-full absolute top-0 left-[-20px] '></div> */}
        </div>
    );
};

export default JumpingLetter;
