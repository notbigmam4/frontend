import { ChangeEvent, useContext, useEffect, useState } from 'react'

import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
  } from "../../@/components/ui/drawer"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "../../@/components/ui/alert-dialog"
  
import { Button } from '../../@/components/ui/button';
import Førerkort from './førerkort';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './GlobalLayout';
import { Input } from '../../@/components/ui/input';
  
import { ClipLoader } from 'react-spinners'
import { Label } from "../../@/components/ui/label"
import { addDataUser, deleteImages, uploadImage } from '../firebase/firebaseUtils';
import { AnimatePresence, motion } from 'framer-motion';
const Onboarding = () => {
    const [img, setImg] = useState<string>('')
    const [imgevent, setImgevent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined)
    const [buttonclicked, setbuttonclicked] = useState<boolean >(false)
    const [nameerror, setnameError] = useState<boolean>(false)
    const [imgerror, setimgError] = useState<boolean>(false)
    const [birthdayerror, setbirthdayError] = useState<boolean>(false)
    const globalcontext = useContext(GlobalContext)
    const [birthday, setbirthday] = useState<string>('')
    const [name, setname] = useState<string>('')
    const [displayterms, setdisplayterms] = useState<boolean>(false)
    const [submitDataError, setsubmitDataError] = useState<boolean>(false)
    const [fullføridloading,setfullføridloading] = useState<boolean>(false)
    const navigate = useNavigate()


    function formatDate(inputDate:string) {
        // Extract the date part (YYYY-MM-DD) from the input
        const datePart = inputDate.split('T')[0];
        
        // Split the date into components
        const [year, month, day] = datePart.split('-');
        
        // Return the formatted date as DDMMYY
        return `${day}${month}${year.slice(2)}`;
    }
    function validateFullName(fullName:string) {
        // Split the full name into its components (by spaces)
        const nameParts = fullName.trim().split(/\s+/);
    
        // Check if there are at least two name parts
        if (nameParts.length < 2) {
            return false;
        }
    
        // Check if each name part has at least two letters
        for (let part of nameParts) {
            if (part.length < 2) {
                return false;
            }
        }
    
        // If all checks pass, the name is valid
        return true;
    }


    useEffect(()=>{
        if (!globalcontext?.user) {
            navigate('/')
          }
    },[globalcontext?.user])

    useEffect(()=>{
        if (!img) {
            setimgError(true)
        } else {
            setimgError(false)
        }
    },[img, buttonclicked])

    useEffect(()=>{
        if (!validateFullName(name)) {
            setnameError(true)
        } else {
            setnameError(false)
        }
    },[name, buttonclicked])

    useEffect(()=>{
        if (!birthday) {
            setbirthdayError(true)
        } else {
            setbirthdayError(false)
        }
    },[birthday, buttonclicked])

    useEffect(()=>{
        if (fullføridloading) {
            setTimeout(() => {
                setfullføridloading(false)
                setdisplayterms(true)
            }, 1000);
        }
    },[fullføridloading])
    
    async function submitData() {
        if (!globalcontext?.user?.id) {
            setsubmitDataError(true)
            alert(`error submitting: ${submitDataError}`)
            return
        }
        await deleteImages(globalcontext.user.id)
        const imgURL = await uploadImage('Imgs',imgevent)
        if (imgURL?.error) {
            console.log('shit')
        } else {
            setImg(imgURL?.imgURL as string) 
        }
        const res = await addDataUser(globalcontext.user.id,imgURL?.imgURL as string,name,birthday)
        if (res?.error) {
            setsubmitDataError(true)
            alert(`error submitting: ${submitDataError}`)
            return
        }
        globalcontext?.setUser(undefined)
    }
    async function uploadfilehelper(e:ChangeEvent<HTMLInputElement>) {
        setImgevent(e)
        const imgURL = await uploadImage(globalcontext?.user?.id as string,e)
        console.log('uploaded')
        if (imgURL?.error) {
            console.log('shit')
        } else {
            setImg(imgURL?.imgURL as string) 
        }
        console.log('uploaded1')

    }




    const [dialogstate, setdialogstate] = useState(0)
    return (
    <div className=' w-[80%] flex ml-[10%] min-h-[calc(100vh-74px)] h-fit overflow-y-scroll flex-col items-center gap-5 pt-12 '>
        <h1 className=' text-xl mt-6 mb-6 '>Fyll inn data til din test-ID</h1>
        
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="image">Førerkort bilde</Label>
            <Input className=' text-[16px] font-light' type="file" placeholder='Ingen fil valgt' onChange={(e)=>{
                if (e.target.value) {
                    uploadfilehelper(e)
                } else {
                    setImg('')
                }
            }}/>
            {
                imgerror&&buttonclicked&&
                <p className=' text-destructive text-sm'>Ugyldig førerkort bilde</p>
            }

        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="fname">Fullt navn</Label>
            <Input className=' text-[16px] font-light' name='fname' type="text" onChange={(e)=>setname(e.target.value)} placeholder='Ola Johan Norman' />
            {
                nameerror&&buttonclicked&&
                <p className=' text-destructive text-sm'>Ugyldig fullt navn</p>
            }

        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="time">Fødsels-dato</Label>
            <Input className=' text-[16px] font-light' type="datetime-local" onChange={(e)=>{
                if (e.target.value) {
                    setbirthday(formatDate(e.target.value))
                } else {
                    setbirthday('')
                }
            }} placeholder='040103'/>
            {
                birthdayerror&&buttonclicked&&
                <p className=' text-destructive text-sm'>Ugyldig fødselsdato</p>
            }
            
        </div>
        <p className=' text-gray-500 text-sm font-bold text-center'>Du kan ikke endre din data etter test-ID er opprettet</p>
        
        {
            displayterms?
            <AlertDialog>
                <AlertDialogTrigger><div className=' px-8 p-2.5 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-5 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80'>Godkjenn vilkår og fullfør ID</div></AlertDialogTrigger>
                <AlertDialogContent aria-describedby={'demo of id'}>
                    <AlertDialogHeader>
                        <AlertDialogTitle >Vilkår</AlertDialogTitle>
                        <div className=' mt-1'></div>
                    </AlertDialogHeader>
                    <AnimatePresence>
                    {   
                        dialogstate === 0&&
                        <motion.div 
                            exit={{ x:600 }}
                            transition={{duration:0.1, type:'tween'}}
                        >
                            <AlertDialogDescription className='  mb-8 text-center' >
                               Jeg forstår at tjenesten skal brukes til å la meg se hvordan forskjellige bilder, navn osv... ville sett ut på mitt førerkort.
                            </AlertDialogDescription>
                            <div className=' mb-1'></div>
                            <AlertDialogFooter>
                                <Button variant={'outline'} onClick={()=>{
                                    setdialogstate(0)
                                    setdisplayterms(false)
                                }}>Avbryt</Button>
                                <Button className=' mb-2' variant={'default'} onClick={()=>setdialogstate(1)}>Godta</Button>
                            </AlertDialogFooter>
                        </motion.div>
                    }
                    {   
                        dialogstate === 1&&
                        <motion.div 
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x:600 }}
                            transition={{duration:0.1, type:'tween'}}
                        >
                            <AlertDialogDescription className='  mb-8 text-center' >
                                Jeg forstår at tjenesten ikke skal misbrukes.
                            </AlertDialogDescription>
                            <div className=' mb-1'></div>
                            <AlertDialogFooter>
                                <Button variant={'outline'} onClick={()=>{
                                    setdialogstate(prev=>prev -= 1)
                                }}>Tilbake</Button>
                                <Button className=' mb-2' variant={'default'} onClick={()=>setdialogstate(2)}>Godta</Button>
                            </AlertDialogFooter>
                        </motion.div>
                    }
                    {   
                        dialogstate === 2&&
                        <motion.div 
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x:600 }}
                            transition={{duration:0.1, type:'tween'}}
                        >
                            <AlertDialogDescription className='  mb-8 text-center' >
                                Jeg forstår at ved brudd på regler vil min konto bli sperret.
                            </AlertDialogDescription>
                            <div className=' mb-1'></div>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={()=>{
                                    setdialogstate(0)
                                    setdisplayterms(false)
                                }}>Avbryt</AlertDialogCancel>
                                <AlertDialogAction onClick={()=>submitData()}>Godkjenn og fullfør</AlertDialogAction>
                            </AlertDialogFooter>
                        </motion.div>
                    }
                        
                    </AnimatePresence>
                </AlertDialogContent>
            </AlertDialog>

            :
            <Button  onClick={()=>{
                
                setbuttonclicked(true)
                if (!(imgerror || nameerror || birthdayerror)) {
                    setfullføridloading(true)
                }
            }}>{!fullføridloading?'Gå videre':<ClipLoader size={22} color='white' className=' mx-6'/>}</Button>
        }
        <Drawer>
            <DrawerTrigger className=' w-full h-fit mt-10'><div className=' px-8 p-2.5 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-5 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'>Forhåndsvis test-ID</div></DrawerTrigger>
            <DrawerContent className=' h-fit'>
                <div className=' relative w-screen h-[500px]'>
                <Førerkort interactive={false} data={{name,birthday,img}} />
                </div>
                
            </DrawerContent>
        </Drawer>

    </div>
    )
}

export default Onboarding