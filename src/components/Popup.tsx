import { useCallback, useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import { Check } from 'lucide-react'
import ios16icon from '../public/ios16_icon.png'
import ios16icon2 from '../public/ios16_icon2.png'
import ios_16_step2 from '../public/ios16_step2.png'
import ios_16_step3 from '../public/ios_16_step3.png'
import ikke_sjult_ios16 from '../public/adressebar_not_hidden_ios16.png'
import { Button } from '../../@/components/ui/button'

const Popup = ({
    display: displayProp,
    onClose,
}: {
    display: boolean,
    onClose?: () => void,
}) => {
    const [display, setDisplay] = useState(false)
    const [isConfirming, setIsConfirming] = useState(false)

    const closeTutorial = useCallback(() => {
        sessionStorage.setItem("tutorial_finished",'true')
        setDisplay(false)
        onClose?.()
    }, [onClose])

    useEffect(()=>{
        if (displayProp) {
            setDisplay(true)
            setIsConfirming(false)
        }
    },[displayProp])

  return (
            <div key={'popup'} className={`bg-black/50 w-screen h-screen z-[150] top-0 left-0 flex justify-center items-center fixed overflow-y-hidden ${!display?'hidden':''}`}>
            <motion.div
                exit={{opacity:0, scale:0.8 }}
                initial={{opacity:0, scale:0.8 }}
                animate={{opacity:1, scale:1 }}

                className=' bg-white w-screen h-screen rounded-lg max-w-[500px] max-h-[500px] flex flex-col items-center text-center px-8 relative py-4 overflow-y-auto '>
                {!isConfirming ? (
                    <>
                        <h1 className='text-lg font-bold'>Skjul adressebar IOS 16+</h1>
                        <p className=' text-gray-500 mt-5 flex gap-1 items-center'>Klikk på <img src={ios16icon}alt="ios 16 icon" className=' w-4 h-4' />
                         deretter <img src={ios16icon2}alt="ios 16 icon" className=' w-4 h-4' />
                        
                         </p>
                         <p className='mb-5 text-gray-500 '>deretter "Skjul verktøylinje"</p>
                        <div className=' flex gap-2 p-1 border-grey-500 border relative h-fit overflow-scroll'>
                            <img className=' h-[280px] border-grey-500 border-r ' src={ikke_sjult_ios16} alt="" />
                            <img className=' h-[280px] border-grey-500 border-r ' src={ios_16_step2} alt="" />
                            <img className=' h-[280px] border-grey-500 border-l ' src={ios_16_step3} alt="" />
                        </div>
                        <div className=' mt-5 w-screnn flex gap-8'>
                            <Button onClick={() => setIsConfirming(true)}>
                                Jeg har skjult adressebaren
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className='flex h-full flex-col items-center justify-center gap-5'>
                        <Check size={48} className='text-green-600' />
                        <h1 className='text-lg font-bold'>Har du skjult adressebaren?</h1>
                        <Button onClick={closeTutorial}>Bekreft</Button>
                    </div>
                )}
            </motion.div>

        </div>
    
  )
}

export default Popup