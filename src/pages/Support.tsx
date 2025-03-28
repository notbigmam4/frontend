
import { useEffect, useState } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { Input } from '../../@/components/ui/input';
import {Textarea} from '../../@/components/ui/textarea'
import { Label } from '../../@/components/ui/label';
import { Button } from '../../@/components/ui/button';
import { AddMessageUser } from '../firebase/firebaseUtils';
import { ClipLoader } from 'react-spinners';
import { Check } from 'lucide-react';

const Support = () => {
    
  const [searchParams] = useSearchParams();
  const [email,setemail] = useState('')
  const [text,settext] = useState('')
  const [sent,setsent] = useState(false)
  const [loading,setloading] = useState(false)
  useEffect(()=>{
    const emailq = searchParams.get('mail');
    if (emailq) {
        setemail(emailq)
    }
  },[])
  return (
    <div className=' w-screen max-w-[500px] min-h-[calc(100vh-74px)] items-center justify-center flex flex-col '>
        <div className=' w-10/12 flex flex-col gap-6 relative'>
           {
            !sent?
            <>
            <div className=' flex flex-col gap-2'>
                <Label>E-post</Label>
                <Input  value={email} onChange={e=>setemail(e.target.value)} placeholder='e-post'/>
            </div>
            <div className=' flex flex-col gap-2'>
                <Label>Melding</Label>
                <Textarea value={text} onChange={e=>settext(e.target.value)}  placeholder='Jeg har ikke mottatt tilgangskode etter betaling...'/>
            </div>
            <div className=' flex justify-between items-center w-full mt-4 '>
                <p className=' text-sm text-muted-foreground h-fit'>Vi sender svar til oppgitt e-post</p>
                <Button disabled={loading || (text.length<4) || (email.length<6)} onClick={()=>{
                    setloading(true)
                    setsent(true)
                    AddMessageUser(email,text)
                    setsent(true)
                    setloading(false)
                }}>{
                    loading?
                    <ClipLoader size={18} className=' mx-12 ' color='black'/>
                    :
                    <div>Send melding</div>

                }</Button>
            </div>
            </>
            :
            <div className=' w-full flex flex-col items-center gap-2'>
            <p className=' flex gap-1 items-center'>Melding sendt <Check size={18} /></p>
            <NavLink to={'/contact'} className={'w-fit h-fit'}><Button variant={'outline'}>Tilbake</Button></NavLink>
            </div>
            }
        </div>
        
        
    </div>  
  )
}

export default Support