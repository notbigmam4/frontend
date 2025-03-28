
import icon from '../public/kontroll-icon.png'
const KontrollButton = () => {
  return (
    <div className=' flex gap-1.5 p-3 bg-[#444E55] text-white w-fit h-fit  items-center text-[16px] font-semibold'>
        <img alt='lol' src={icon} className=' w-[30px]'/>
        Kontroll
    </div>
  )
}

export default KontrollButton