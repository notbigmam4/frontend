
import Footer from '../components/Footer';
import { Maximize2 } from "lucide-react";
import mopedicon from '../public/mopedicon.png'
import caricon from '../public/caricon.png'
import InfoButton from '../components/info-button';
import JumpingLetter from '../components/JumpingLetter';
import RotatingImage from '../components/RotateImage';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './GlobalLayout';
import { useContext, useEffect, useState } from 'react';
import {motion} from 'framer-motion'
import Popup from '../components/Popup';
const Førerkort = ({interactive,data}:{interactive:boolean,data:{name:string|undefined,birthday:string|undefined,img:string|undefined}|undefined}) => {
  const navigate = useNavigate()
  const [displaytutorial, setdisplaytutorial] = useState(false)
  const [navdireaction, setnavdireaction] = useState<'right'|'left'>('right')
  const [navpath, setnavpath] = useState('')
  const globalcontext = useContext(GlobalContext)
  useEffect(()=>{
    const tutorial = sessionStorage.getItem("tutorial_finished");
    if (!tutorial) {
      setdisplaytutorial(true)
    }
  },[])
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
    <>
      {
        displaytutorial&&interactive &&
        <Popup display={displaytutorial}/>
        
      }
      <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ 
        transition: {duration:0.5, type:'tween'},
        x:navdireaction==='right'?600:-600
       }}
      transition={{duration:0.1, type:'tween'}}
      >
      {
        interactive&&
        <Navbar setnavdireaction={setnavdireaction} setnavpath={setnavpath}/>
      }
      <div className={` hide-scrollbar h-screen w-full overflow-y-scroll ${!interactive?' h-full scale-90 overflow-y-hidden ':'pt-[74px]'} 
        overflow-x-hidden flex flex-col items-center  `}>
            
              
              <RotatingImage left={true}/>
            
              <div className=" border-[#E8E8E8] border w-[45%] h-fit p-1 relative z-10 bg-white">
                <div className="  w-fit h-fit absolute right-[2px] top-[10px]">
                  <JumpingLetter />
                </div>
                <img loading='eager' alt="..." src={data?data.img:globalcontext?.user?.img} className=" w-full object-cover" onClick={()=>{
                  if (interactive) {
                    setnavpath('/p')
                  }
                }}/>
                <div className=" border-[#E8E8E8] border-t border-r absolute bottom-0 left-0 w-fit h-fit p-1 bg-white" onClick={()=>{
                  if (interactive) {
                    setnavpath('/p')
                  }
                }}>
                  <Maximize2 size={18} className=" text-[#444f55]"/>
                </div>
              </div>
              <h1 className=" text-[24px] text-[#444f55] mt-2">{data?data?.name?.toUpperCase():globalcontext?.user?.name.toUpperCase()}</h1>
              <h5 className=" text-[16px] text-[#444f55] mt-1 font-light">{data?data.birthday:globalcontext?.user?.birthday} 81271</h5>
              <div className=" flex gap-3 w-full h-fit ml-8 mt-10 z-10">
                  <InfoButton className="border-l-[5px] flex flex-col p-1 pl-2.5 justify-between w-[44.5%]">
                    <div className=" text-xl font-bold text-[#444f55] mb-1 ">B</div>
                    <img className=" h-[22px] w-auto" alt="car" src={caricon} />
                    
                  </InfoButton>
                  <InfoButton className="border-l-[5px] flex flex-col p-1 pl-2.5 justify-between w-[44.5%]">
                    <div className=" text-xl font-bold text-[#444f55] mb-1 ">AM</div>
                    <img className=" h-[22px] w-auto" alt="car" src={mopedicon} />
                  </InfoButton>
              </div>
              <h5 className=" text-[15px] text-[#444f55] font-light mt-10">Sist oppdatert: {date}</h5>

          </div>
          {
            interactive&&
            <Footer setnavdireaction={setnavdireaction} setnavpath={setnavpath}/>
          }
      </motion.div>
    </>
  )
}

export default Førerkort