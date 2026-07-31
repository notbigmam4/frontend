
import { FormEvent, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth'
import { createUser, GetMessages, getUsers, setDagenstall } from '../firebase/firebaseUtils'
import type { SupportMessage } from '../firebase/firebaseUtils'
import { auth } from '../firebase/firebaseConfig'
import { Input } from '../../@/components/ui/input'
import { Button } from '../../@/components/ui/button'
import { ArrowRight, Clipboard, LogOut } from 'lucide-react'
import { Label } from '../../@/components/ui/label'
import { DataTableDemo } from '../components/Tableconfig'
import { UserType } from '../types/User'
import ActivityLogDashboard from '../components/ActivityLogDashboard'

const Boss = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authUser, setAuthUser] = useState<User | null | undefined>(undefined)
    const [authError, setAuthError] = useState('')
    const [authLoading, setAuthLoading] = useState(false)
    const [authorized, setAuthorized] = useState(false)
    const [dagenstall, setdagenstall] = useState('')
    const [code, setCode] = useState<string>('')
    const [slug, setslug] = useState('')
    const [users, setusers] = useState<undefined | UserType[]>(undefined)
    const [update, setupdate] = useState<boolean>(false)
    const [messages, setmessages] = useState<undefined | SupportMessage[]>(undefined)
    const [bossView, setBossView] = useState<'users' | 'activity'>('users')

    useEffect(()=>{
        return onAuthStateChanged(auth, (user)=>{
            setAuthUser(user)
            if (!user) {
                setAuthorized(false)
                setusers(undefined)
                setmessages(undefined)
            }
        })
    }, [])

    useEffect(()=>{
        if (!authUser) return

        let cancelled = false
        async function loadAdminData() {
            setAuthLoading(true)
            setAuthError('')
            try {
                const [loadedUsers, loadedMessages] = await Promise.all([
                    getUsers(),
                    GetMessages()
                ])
                if (cancelled) return
                setusers(loadedUsers)
                setmessages(loadedMessages)
                setAuthorized(true)
            } catch {
                if (cancelled) return
                setAuthorized(false)
                setAuthError('Denne Firebase-brukeren har ikke administratortilgang.')
            } finally {
                if (!cancelled) setAuthLoading(false)
            }
        }

        void loadAdminData()
        return ()=>{ cancelled = true }
    }, [authUser, update])

    async function handleLogin(event:FormEvent) {
        event.preventDefault()
        setAuthLoading(true)
        setAuthError('')
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password)
            setPassword('')
        } catch {
            setAuthError('Ugyldig e-post eller passord.')
            setAuthLoading(false)
        }
    }

    async function generateCode() {
        if (!slug.trim()) return
        setAuthError('')
        try {
            const generatedCode = await createUser(slug.trim())
            setCode(generatedCode)
            setupdate((value)=>!value)
        } catch {
            setAuthError('Kunne ikke opprette bruker.')
        }
    }

    async function handleDagenstallUpdate() {
        setAuthError('')
        try {
            await setDagenstall(dagenstall)
        } catch {
            setAuthError('Kunne ikke oppdatere dagens tall.')
        }
    }

    return (
        <div className={`flex w-screen flex-col items-center justify-center gap-6 p-4 sm:p-8 h-fit min-h-[calc(100vh-74px)] ${authorized ? 'max-w-[1200px]' : 'max-w-[500px]'}`}>
            {authError && <p className='text-sm text-destructive'>{authError}</p>}
            {authUser === undefined ? (
                <p className='text-sm text-muted-foreground'>Kontrollerer innlogging...</p>
            ) : !authUser ? (
                <form className='flex w-full flex-col gap-4' onSubmit={handleLogin}>
                    <div className='grid gap-1.5'>
                        <Label htmlFor='admin-email'>E-post</Label>
                        <Input
                            id='admin-email'
                            type='email'
                            autoComplete='username'
                            value={email}
                            onChange={(event)=>setEmail(event.target.value)}
                            required
                        />
                    </div>
                    <div className='grid gap-1.5'>
                        <Label htmlFor='admin-password'>Passord</Label>
                        <Input
                            id='admin-password'
                            type='password'
                            autoComplete='current-password'
                            value={password}
                            onChange={(event)=>setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <Button type='submit' disabled={authLoading}>
                        {authLoading ? 'Logger inn...' : 'Logg inn'}
                    </Button>
                </form>
            ) : !authorized ? (
                <div className='flex flex-col items-center gap-4'>
                    {authLoading && <p className='text-sm text-muted-foreground'>Kontrollerer administratortilgang...</p>}
                    {!authLoading && (
                        <Button variant='outline' onClick={()=>void signOut(auth)}>
                            <LogOut size={16}/> Logg ut
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className='flex w-full items-center justify-between'>
                        <p className='text-sm text-muted-foreground'>{authUser.email}</p>
                        <Button variant='outline' onClick={()=>void signOut(auth)}>
                            <LogOut size={16}/> Logg ut
                        </Button>
                    </div>
                    <div className=' flex w-full max-w-[500px] gap-2'>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="time">Dagens tall</Label>
                            <Input placeholder='Dagens tall' className='' type="number" value={dagenstall} onChange={(e)=>setdagenstall(e.target.value)} />
                        </div>
                        <Button className=' mt-6' onClick={()=>void handleDagenstallUpdate()}>
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
                                    setCode('')
                                    setslug('')
                                }} className=' '>fortsett</Button>
                                :
                                <Button onClick={()=>void generateCode()} className=' '>Ny bruker</Button>
                        }
                        
                    </div>
                    
                    <div className='grid w-full max-w-md grid-cols-2 rounded-lg bg-slate-100 p-1'>
                        <Button
                            variant={bossView === 'users' ? 'default' : 'ghost'}
                            onClick={()=>setBossView('users')}
                        >
                            Brukere
                        </Button>
                        <Button
                            variant={bossView === 'activity' ? 'default' : 'ghost'}
                            onClick={()=>setBossView('activity')}
                        >
                            Aktivitet
                        </Button>
                    </div>
                    {bossView==='activity'&&
                        <ActivityLogDashboard/>
                    }
                    
                    {bossView==='users'&&users &&
                        <>
                        <div className=' w-full h-[1px] bg-border'></div>
                        <DataTableDemo setupdate={setupdate} data={users}/>
                        </>
                    }
                    {bossView==='users'&&messages &&
                        <>
                        <div className=' w-full h-[1px] bg-border'></div>
                        <div className='w-full'>
                            {messages.map((message)=>(
                                <div className='mb-10' key={message.id}>
                                    <h1>Melding fra {message.email}</h1>
                                    <p className='whitespace-pre-wrap break-words'>{message.message}</p>
                                </div>
                            ))}
                        </div>
                        
                        </>
                    }
                </>
            )}
        </div>
    )
}

export default Boss