
const Stepper = ({steps,currentStep,rows}:{steps:string[], currentStep:number,rows:1|2}) => {
  return (
    <div className={` grid grid-rows-${rows} grid-cols-3  w-full gap-3`}>
    {
        steps.map((step,i)=>{
            return (
                <div className={` flex gap-[6px] h-fit w-full justify-center items-center text-sm ${i===currentStep?'font-semibold':''}`}>
                  <div className={` border-black border flex items-center justify-center w-7 h-7 rounded-full
                     ${i===currentStep?'bg-black text-white':'bg-white text-black'}`}>
                    {i+1}
                  </div>
                  <div>
                    {step}
                  </div>

                </div>
            )
        })
    }
    </div>
  )
}

export default Stepper