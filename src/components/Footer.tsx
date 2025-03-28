
import KontrollButton from './kontroll-button'
import InfoButton from './info-button'

const Footer = ({setnavdireaction, setnavpath}:{setnavdireaction:Function, setnavpath:Function}) => {
  return (
    <div className=' w-screen fixed bottom-0 h-[100px] bg-white left-0 shadow-2xl flex items-center justify-between px-[16px]'>
        <div className=' bg-gradient-to-b from-white to-black/5 left-0 h-[8px] fixed bottom-[100px] w-full text-[#555E44]'> </div>
        <div className=' text-[16px] flex flex-col gap-1'>
            <h4>Førerkortkoder</h4>
            <InfoButton><span className=' font-semibold'>100</span> Prøveperiode</InfoButton>
        </div>
        <div className=' w-fit h-fit' onClick={()=>{
          setnavdireaction('right')
          setnavpath('/k')
        }}>
          <KontrollButton />
        </div>
    </div>
  )
}

export default Footer