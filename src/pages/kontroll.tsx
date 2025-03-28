
import { useContext, useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import Navbar from '../components/Navbar'
import qr from  '../public/qrcode.png'
import RotatingImage from '../components/RotateImage'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from './GlobalLayout'
const Kontroll = () => {
    const [navdireaction, setnavdireaction] = useState<'right'|'left'>('right')
    const [navpath, setnavpath] = useState('')
    const globalcontext = useContext(GlobalContext)
    const navigate = useNavigate()

    function formatDate() {
        const now = new Date();
  
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
  
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
  
        return `${day}.${month}.${year} kl. ${hours}:${minutes}`;
    }
    const date = formatDate()

    useEffect(()=>{
        if (!globalcontext?.user) {
            navigate('/')
          }
    },[globalcontext?.user])

    useEffect(()=>{
        if (navpath) {
          navigate(navpath)
        }
      },[navpath])
    return (
            <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{x:navdireaction==='right'?600:-600 }}
            transition={{duration:0.2, type:'tween'}}
            > 
            <RotatingImage left={false}/>
            <Navbar setnavdireaction={setnavdireaction} setnavpath={setnavpath}/>
            <div className=" hide-scrollbar h-[800px] w-screen overflow-y-scroll overflow-x-hidden flex flex-col items-center pt-[74px]  ">
                <h5 className=" text-[16px] text-[#444f55] mt-1 font-normal">Dagens tall</h5>
                <h5 className=" text-[70px] text-[#444f55] mt-0 font-bold tracking-tight leading-snug ">
                    {globalcontext?.user?.dagenstall}
                </h5>
                <div className=" border-[#E8E8E8] border w-[74%] h-fit p-2.5 relative z-10 bg-white">
                <img src={qr} alt='qr' className=" w-full h-full"/>
                </div>
                <h5 className=" text-[15px] text-[#444f55] font-light mt-3">Sist oppdatert: {date}</h5>

                <div className=' mt-8 w-full pl-[13%]'>
                    <h5 className=" text-[11px] text-[#444f55] font-light">Førerkortnummer</h5>
                    <h3 className='text-[#444f55] font-normal text-[20px]'>95 24 0447400</h3>
                    <div className=' h-[1px] w-[32px] mt-3 bg-[#E8E8E8]'></div>
                </div>
                <div className=' mt-3 w-full pl-[13%]'>
                    <h5 className=" text-[11px] text-[#444f55] font-light">Fødselsnummer</h5>
                    <h3 className='text-[#444f55] font-normal text-[20px]'>{globalcontext?.user?.birthday} 81271</h3>
                    <div className=' h-[1px] w-[32px] mt-3 bg-[#E8E8E8]'></div>
                </div>
                <div className=' fixed bottom-[70px] text-[26px]  tracking-tight font-semibold right-[40px]'>
                    <p className=' text-[#e9e9e9] leading-5'>NORGE</p>
                    <p className=' text-[#f7f7f7] leading-5'>NOREG</p>

                </div>

                <div className=' flex gap-6 mt-4 w-full pl-[13%]'>
                    <div className=' w-fit'>
                        <h5 className=" text-[11px] text-[#444f55] font-light">Utstedt</h5>
                        <h3 className='text-[#444f55] font-normal text-[16px]'>06.03.2022</h3>
                    </div>
                    <div className=' w-fit'>
                        <h5 className=" text-[11px] text-[#444f55] font-light">Gyldig t.o.m</h5>
                        <h3 className='text-[#444f55] font-normal text-[16px]'>03.04.2035</h3>
                    </div>
                </div>
            </div>
        </motion.div>
  )
}

export default Kontroll