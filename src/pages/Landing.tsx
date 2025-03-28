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
        <div className=' w-screen h-[calc(100vh-74px)] flex flex-col items-center justify-center gap-3'>
            <div className="flex flex-col items-center text-2xl mb-12 font-regular text-[#444f55] ">
                <h1 className=' '>Tast inn din </h1>
                <h1 className=' '>personlige kode</h1>
            </div>
            <InputOTP id='otpinput' maxLength={6} onChange={(e)=>{setval(e)}} value={valauthenting?staticVal:val}>
                <InputOTPGroup >
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
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
                
                <NavLink to={'/contact'} className=' cursor-pointer underline text-[#444f55] mt-0'>Jeg har ikke kode</NavLink>

            }
            
            

        </div>
    )
}

export default Landing