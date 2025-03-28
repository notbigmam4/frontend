
import { useContext, useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from './GlobalLayout'
import signatur from '../public/signatur.png'
const Personalia = () => {
    const [navdireaction, setnavdireaction] = useState<'right'|'left'>('right')
    const [navpath, setnavpath] = useState('')
    const globalcontext = useContext(GlobalContext)
    const navigate = useNavigate()

    

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
            <Navbar setnavdireaction={setnavdireaction} setnavpath={setnavpath}/>
            <div className=" hide-scrollbar h-[800px] w-screen overflow-y-scroll overflow-x-hidden flex flex-col items-center pt-[74px]  ">
                <div className=" border-[#E8E8E8] border w-[94%] h-fit p-2.5 relative z-10 bg-white mt-8">
                    <img loading='eager' alt="..." src={globalcontext?.user?.img} className=" w-full object-cover"/>
                </div>
                
              <h1 className=" text-[24px] text-[#444f55] mt-2">{globalcontext?.user?.name.toUpperCase()}</h1>
              <h5 className=" text-[16px] text-[#444f55] font-light">{globalcontext?.user?.birthday} 81271</h5>
              <img loading='eager' alt="..." src={signatur} className=" w-10/12 object-cover"/>



                
            </div>
        </motion.div>
  )
}

export default Personalia