import { Outlet,useLocation,useNavigate } from 'react-router-dom'
import { createContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import {Helmet} from 'react-helmet'
import qr from '../public/qrcode.png'
import signatur from '../public/signatur.png'

type ImageDimensions = {
  width: number
  height: number
}

type User = {
  name: string
  birthday: string
  img: string
  dagenstall: string
  id: string
}

const GlobalContext = createContext<{
  user:User | undefined,
  setUser:(user:Partial<User> | undefined) => void,
  userImageAspectRatio:number | undefined,
  userImageSrc:string | undefined
}|undefined>(undefined)

function preloadImage(src:string):Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = async () => {
      try {
        await image.decode()
      } catch {
        // The loaded image can still be displayed when explicit decoding is unavailable.
      }

      resolve({ width: image.naturalWidth, height: image.naturalHeight })
    }
    image.onerror = () => reject(new Error(`Could not preload image: ${src}`))
    image.src = src
  })
}

async function prepareUserImage(src:string) {
  try {
    const response = await fetch(src)
    if (!response.ok) {
      throw new Error(`Could not fetch image: ${response.status}`)
    }

    const objectUrl = URL.createObjectURL(await response.blob())
    try {
      const dimensions = await preloadImage(objectUrl)
      return { dimensions, src: objectUrl, objectUrl }
    } catch (error) {
      URL.revokeObjectURL(objectUrl)
      throw error
    }
  } catch {
    const dimensions = await preloadImage(src)
    return { dimensions, src, objectUrl: undefined }
  }
}

const GlobalLayout = () => {
  console.log('global layout')
  const [user, setUser] = useState<User>()
  const [userImageAspectRatio, setUserImageAspectRatio] = useState<number>()
  const [userImageSrc, setUserImageSrc] = useState<string>()
  const navigate = useNavigate()
  const location = useLocation()
  const navigateRef = useRef(navigate)
  const pathRef = useRef(location.pathname)
  navigateRef.current = navigate
  pathRef.current = location.pathname

  useEffect(()=>{
    let cancelled = false

    if (!user?.name && user) {
      navigateRef.current('/onboarding')
    }
    if (user?.name) {
      sessionStorage.setItem('id',user.id)
      void Promise.allSettled([
        prepareUserImage(user.img),
        preloadImage(qr),
        preloadImage(signatur)
      ]).then(([userImage]) => {
        if (cancelled) {
          if (userImage.status === 'fulfilled' && userImage.value.objectUrl) {
            URL.revokeObjectURL(userImage.value.objectUrl)
          }
          return
        }

        if (userImage.status === 'fulfilled') {
          const { dimensions, src } = userImage.value
          if (dimensions.height > 0) {
            setUserImageAspectRatio(dimensions.width / dimensions.height)
          }
          setUserImageSrc(src)
        }
        if (pathRef.current === '/') {
          navigateRef.current("/f")
        }
      })
    }

    return () => {
      cancelled = true
      setUserImageSrc(currentSrc => {
        if (currentSrc?.startsWith('blob:')) {
          URL.revokeObjectURL(currentSrc)
        }
        return undefined
      })
    }
  },[user])

  return (
    <div className=' w-screen h-fit overflow-hidden hide-scrollbar  '>
        {
          user?.img&&
          <Helmet>
          <link rel="preload" href={user.img} as="image" fetchPriority="high"/>
          <link rel="preload" href={qr} as="image"/>
          <link rel="preload" href={signatur} as="image"/>
        </Helmet>
        }
        <GlobalContext.Provider
          value={{
            user,
            setUser: nextUser => setUser(nextUser as User | undefined),
            userImageAspectRatio,
            userImageSrc
          }}
        >
          <AnimatePresence>
            <Outlet />
          </AnimatePresence>
        </GlobalContext.Provider>
    </div>
  )
}
export {GlobalContext}
export default GlobalLayout