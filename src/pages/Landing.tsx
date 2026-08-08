import { useContext, useEffect, useState } from 'react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "../../@/components/ui/input-otp"
import { ClipLoader } from 'react-spinners'
import {getDagenstall, getUser} from '../firebase/firebaseUtils'
import { GlobalContext } from './GlobalLayout'
import { NavLink } from 'react-router-dom'
import { claimAppOpen, logActivity } from '../services/activityLogger'


const Landing = () => {
    const globalcontext = useContext(GlobalContext)


    const [val,setval] = useState('')
    const [staticVal,setStaticVal] = useState('')
    const [valauthenting,setValauthenting] = useState(false)
    const [error, seterror] = useState<false | string>(false)
    
    useEffect(()=>{
        if (val.length > 5 && !valauthenting) {
            setStaticVal(val)
            setValauthenting(true)
        }
    },[val])

    useEffect(()=>{
        async function getdata() {
            if (!globalcontext) return 
            
            seterror(false)
            const userobj = await getUser(val)
            const dagensdata = await getDagenstall() as {data:{dagenstall:string}}
            if (userobj?.error) {
                setValauthenting(false)
                seterror(userobj.error)
                sessionStorage.removeItem('id')
            } else {
                const userData = userobj?.data as {name?:string} | undefined
                if (claimAppOpen()) {
                    void logActivity('app_open', {
                        user:{
                            id:val,
                            ...(userData?.name ? {name:userData.name} : {})
                        }
                    })
                }
                sessionStorage.setItem('id',val)
                globalcontext.setUser({...userobj.data,id:val,dagenstall:dagensdata.data.dagenstall})
                setValauthenting(false)


            }
            
        }
        if (valauthenting) {
            getdata()
        }
    },[valauthenting])
    useEffect(()=>{
        if (sessionStorage.getItem('id')) {
            setval(sessionStorage.getItem('id') as string)
        }
    },[])
    useEffect(()=>{
        document.getElementById("otpinput")?.focus();
    },[])
    return (
        <div className=' w-screen h-[calc(100vh-74px)] flex flex-col items-center justify-center gap-3 pb-24'>
            <div className="flex flex-col items-center text-2xl mb-12 font-regular text-[#444f55] ">
                <h1>Tast inn din personlige</h1>
                <h1>kode</h1>
            </div>
            <InputOTP id='otpinput' maxLength={6} onChange={(e)=>setval(e)} value={valauthenting?staticVal:val}>
                <InputOTPGroup >
                    <InputOTPSlot index={0} className="h-12 w-12 text-base" />
                    <InputOTPSlot index={1} className="h-12 w-12 text-base" />
                    <InputOTPSlot index={2} className="h-12 w-12 text-base" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} className="h-12 w-12 text-base" />
                    <InputOTPSlot index={4} className="h-12 w-12 text-base" />
                    <InputOTPSlot index={5} className="h-12 w-12 text-base" />
                </InputOTPGroup>
            </InputOTP>
            <div
                className='mt-5 flex max-w-[360px] items-center gap-3.5 px-2 pointer-events-none select-none'
                aria-hidden
            >
                <div className='relative h-[32px] w-[54px] shrink-0 rounded-full bg-[#e5e5ea]'>
                    <div className='absolute left-[2px] top-[2px] h-[28px] w-[28px] rounded-full bg-white shadow-sm' />
                </div>
                <p className='text-[16px] leading-snug text-[#444f55]'>
                    Aktiver pålogging med fingeravtrykk / ansiktsgjenkjenning
                </p>
            </div>
            {
                error&&
                <p className=' text-destructive mt-6'>{error}</p>
            }
            {
                valauthenting?
                <ClipLoader
                    color={'black'}
                    loading={valauthenting}
                    size={40}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    className=' mt-10'
                />
                :
                
                <NavLink to={'/contact'} className=' cursor-pointer underline text-[#444f55] mt-6'>Jeg har ikke kode</NavLink>

            }
        </div>
    )
}

export default Landing