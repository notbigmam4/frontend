import { Outlet,useNavigate } from 'react-router-dom'
import { createContext, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import {Helmet} from 'react-helmet'
const GlobalContext = createContext<{user:{name:string, birthday:string,img:string,dagenstall:string,id:string}| undefined,setUser:Function}|undefined>(undefined)

const GlobalLayout = () => {

  const [user, setUser] = useState<{name:string, birthday:string,img:string,dagenstall:string,id:string}| undefined>(undefined)
  const navigate = useNavigate()

  async function cacheImages(src:string) {
      new Image().src = src   
  }
  useEffect(()=>{
    if (!user?.name && user) {
      navigate('/onboarding')
    }
    if (user?.name) {
      sessionStorage.setItem('id',user.id)
      cacheImages(user.img)
      navigate("/f")
    }
  },[user])
  
  return (
    <div className=' w-screen h-fit overflow-hidden hide-scrollbar  '>
        {
          user?.img&&
          <Helmet>
          <link rel="preload" href={user.img} as="image"/>
          <link rel="prefetch" href={user.img} as="image"/>
        </Helmet>
        }
        <GlobalContext.Provider value={{user, setUser}}>
          <AnimatePresence>
            <Outlet />
          </AnimatePresence>
        </GlobalContext.Provider>
    </div>
  )
}
export {GlobalContext}
export default GlobalLayout