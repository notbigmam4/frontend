import { useContext } from 'react'
import { Button } from '../../@/components/ui/button'
import { Label } from '../../@/components/ui/label'

import { GlobalContext } from './GlobalLayout';
import { NavLink } from 'react-router-dom';
const Profile = () => {
    
  const globalcontext = useContext(GlobalContext)
  return (
    <div className=' w-screen min-h-screen pt-8 px-4 flex flex-col gap-2'>
        
        <div className=' flex justify-between'>
            <h5 className="text-lg font-bold mb-1.5">Din profil </h5>
            <span className=' text-muted-foreground'>Utløper <span className=' underline'>05/10/24</span></span>
        </div>
        <Label>Bilde</Label>
        <div className=' mb-6 items-center flex h-fit w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>        
            <img src={globalcontext?.user?.img}/>
        </div>
        <Label>Navn</Label>
        <div className=' mb-6 items-center flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>        
            {globalcontext?.user?.name}
        </div>
        <Label>Fødselsdato</Label>
        <div className=' mb-6 items-center flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>        
            {globalcontext?.user?.birthday}
        </div>
        <NavLink to={'/h'}><Button variant={'outline'}  className=' '>Tilbake </Button></NavLink>
        

        
    </div>
  )
}

export default Profile