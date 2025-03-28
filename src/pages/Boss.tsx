
import { ReactNode, useEffect, useState } from 'react'
import { createUser, GetMessages, getUsers, setDagenstall } from '../firebase/firebaseUtils'
import { Input } from '../../@/components/ui/input'
import { Button } from '../../@/components/ui/button'
import { ArrowRight, Clipboard } from 'lucide-react'
import { Label } from '../../@/components/ui/label'
import { DataTableDemo } from '../components/Tableconfig'
import { UserType } from '../types/User'

const Boss = () => {
    const [inp, setInp] = useState('')
    const [admin, setAdmin] = useState<false | 'boss' | 'plug'>(false)
    const [dagenstall, setdagenstall] = useState('')
    const [code, setCode] = useState<string>('')
    const [clicked, setClicked] = useState(false)
    const [slug, setslug] = useState('')
    const [users, setusers] = useState<undefined | UserType[]>(undefined)
    const [update, setupdate] = useState<boolean>(false)
    const [messages, setmessages] = useState<undefined | {data:Function}[]>(undefined)
    function wordsToObj(str:string) {
        // Split the string by commas to get an array of words
        const wordsArray = str.split(',');
    
        // Initialize an empty object
        const result: { [key: string]: any } = {};
    
        // Iterate over the array of words
        wordsArray.forEach((word:string) => {
            // Trim whitespace from each word and set it as a key in the object with the value true
            result[word] = true;
        });
    
        return result;
    }
    useEffect(()=>{
        async function generateCode() {
            const code = await createUser(slug,inp)
            setCode(code)
        }
        if (clicked) {
            generateCode()
            setClicked(false)
            
        }
    },[clicked])
    useEffect(()=>{
        async function getUserutil() {
            const usersutil = await getUsers()
            setusers(usersutil)
        }
        getUserutil()
    },[update])

    useEffect(()=>{
        async function getMessagesutil() {
            const usersutil = await GetMessages() 
            setmessages(usersutil) 
        }
        getMessagesutil()
    },[update])
    setmessages
    useEffect(()=>{
        document.getElementById("passinp")?.focus();
    },[])
    return (
        <div className=' flex flex-col justify-center items-center w-screen h-fit min-h-[calc(100vh-74px)] gap-6 p-8 max-w-[500px]'>
            {
                !admin?
                <div className=' flex w-full  gap-2 '>
                    <Input id='passinp' className='' type="password" value={inp} onChange={(e)=>setInp(e.target.value)} />
                    <Button onClick={()=>{
                        const plugadminobj = wordsToObj(import.meta.env.VITE_PLUGPASSWORD)
                        if (inp === import.meta.env.VITE_ADMINPASSWORD) {
                            setAdmin('boss')
                        } else if (plugadminobj[inp]) {
                            setAdmin('plug')
                        }
                            
                        
                        
                        }}>
                        

                        <ArrowRight size={20}/>

                    </Button>
                </div>
                :
                <>
                    <div className=' flex w-full max-w-[500px] gap-2'>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="time">Dagens tall</Label>
                            <Input placeholder='Dagens tall' className='' type="number" value={dagenstall} onChange={(e)=>setdagenstall(e.target.value)} />
                        </div>
                        <Button className=' mt-6' onClick={()=>{
                            setDagenstall(dagenstall)
                        }}>
                            Oppdater<ArrowRight size={20}/>
                        </Button>
                    </div>
                    <div className=' w-full h-[1px] bg-border '></div>
                    <div className=' flex w-full  gap-2'>
                        
                            {
                                code?
                                <div className=' items-center flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>
                                    
                                    <div className=' flex w-full justify-between' onClick={()=>{
                                        navigator.clipboard.writeText(code)
                                    }}>
                                        <div>{code}</div>
                                        <div><Clipboard size={16} color='grey' /></div>
                                    </div>
                                    
                                </div>
                                
                                :
                                <Input placeholder='hvem skal kode være til' value={slug} onChange={(e)=>setslug(e.target.value)}/>
                                    
                            }
                        {
                                code?
                                <Button onClick={()=>{
                                    setClicked(false)
                                    setCode('')
                                    setslug('')
                                }} className=' '>fortsett</Button>
                                :
                                <Button onClick={()=>{
                                    setClicked(true)
                                }} className=' '>Ny bruker</Button>
                        }
                        
                    </div>
                    
                    

                    {
                        admin==='boss'&&users &&
                        <>
                        <div className=' w-full h-[1px] bg-border'></div>
                        <DataTableDemo setupdate={setupdate} data={users}/>
                        </>
                    }
                    {
                        admin==='boss'&&messages &&
                        <>
                        <div className=' w-full h-[1px] bg-border'></div>
                        <div>
                            {
                                messages.map((msg)=>{
                                    const obj = msg.data()
                                    const values = Object.values(obj);
                                    return (
                                        <div className=' mb-10'>
                                            <h1>Meldinger fra {obj.email}</h1>
                                            {
                                                JSON.stringify(values)
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        
                        </>
                    }
                    

                    
                        
                </>
            }
        </div>
    )
}

export default Boss