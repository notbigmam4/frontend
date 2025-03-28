
import { motion } from 'framer-motion';
import shape2 from '../public/shape2.png'

const RotatingImage = ({left}:{left:boolean}) => {
    return (
        <motion.div
            
            className={`${left?'left-[-250px]':'right-[-250px]'} -z-10 fixed  top-[150px] h-[550px] w-auto`} // Tailwind CSS classes for sizing (optional)
            animate={{ rotate: 360 }} // Rotate the image 360 degrees
            transition={{
                repeat: Infinity, // Repeat the animation infinitely
                duration: 100, // Duration of the rotation (10 seconds for a slow rotation)
                ease: "linear", // Linear easing for constant speed
            }}
        >
            <img src={shape2} alt="bg image" className=" h-[500px] w-auto opacity-50"/>
            
        </motion.div>
    );
};

export default RotatingImage;
