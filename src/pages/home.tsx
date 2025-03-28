
import {motion} from 'framer-motion'
import RotatingImage from '../components/RotateImage'
import { User } from 'lucide-react'
import logo from '../public/logo.png'
import { NavLink } from 'react-router-dom'
const Home = () => {



  return (
    <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{x:-600 }}
            transition={{duration:0.2, type:'tween'}}
            className=' h-screen w-screen relative'
            > 
            <RotatingImage left={false}/>

            <div className=' flex h-[10%] w-full px-8 flex-row-reverse pt-[36px] '> 
                <div className=' flex flex-col items-center w-fit h-fit'>
                        <NavLink to={'/d'}><User size={20} /></NavLink>
                        <div className=' text-[12px] font-medium leading-snug'>Profil</div>
                </div>
            </div>

            <div className=" hide-scrollbar h-[90%] w-full overflow-y-scroll overflow-x-hidden flex flex-col justify-between items-center pb-10  ">
                
                <div className=' flex h-fit w-full px-8 items-center justify-center '> 
                    <div className=' flex flex-col items-center w-fit h-fit'>
                         <img src={logo} className=' scale-[0.80]'/>
                         <div className=' text-[17px] leading-snug text-[#363f44] font-bold'>Statens vegvesen</div>
                    </div>
                </div>

                <div className=' text-[42px]  tracking-tight font-semibold '>
                    <p className=' text-[#e9e9e9] leading-7'>NORGE</p>
                    <p className=' text-[#f7f7f7] leading-7'>NOREG</p>
                </div>

                <div className=' flex flex-col gap-5 w-full items-center '>
                    <NavLink to={'/f'} className=' w-[60%] py-3.5 flex bg-[#FF9600] items-center justify-center font-semibold'><div>Ditt test-førerkort</div></NavLink>
                    <NavLink to={'/f'} className=' w-[60%] py-3.5 flex bg-[#EDEDED] items-center justify-center font-semibold'><div>Se dine detaljer</div></NavLink>
                </div>
            </div>
        </motion.div>
  )
}

export default Home