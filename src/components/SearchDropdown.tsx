import { useEffect, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../@/components/ui/dialog"
import { Input } from "../../@/components/ui/input"
import { Button } from "../../@/components/ui/button"




import { søkByer } from "../utils"
import { Search } from "lucide-react"
import { Label } from "../../@/components/ui/label"
const SearchDropdown = ({setselected}:{setselected:Function}) => {
    const [q,setq] = useState('')
    const [filteredlist, setfilteredlist] = useState<string[]>([])
    useEffect(()=>{
        
            if (q) {
                setfilteredlist(søkByer(q))
            }
    },[q])
    useEffect(()=>{
        console.log(filteredlist)
    },[filteredlist])
    let i = 0
  return (
    <div className=" flex flex-col gap-2">
    <Label>Velg By</Label>
    <Dialog>
        <DialogTrigger asChild>
        <Button variant="outline"><Search size={14} className=" mr-1"/>Søk Byer i Norge </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Søk Byer i Norge</DialogTitle>
            </DialogHeader>
        <div className=" w-full h-full flex flex-col gap-2 mt-2">
            <Input value={q} onChange={e=>setq(e.target.value)} placeholder="Trondheim..."/>
            {
                filteredlist?filteredlist.map((res:any)=>{
                i +=1
                if (i>10){
                    return
                }
                return (
                    <DialogClose key={res}>
                    <div className=' h-auto  w-12/12 outline-none flex px-2 py-1 items-center hover:bg-background rounded justify-between overflow-hidden text-nowrap'
                        onClick={()=>{
                            setselected(res)
                            
                        }}>
                        {res}
                    </div>
                    </DialogClose>
                )
                })
                :
                null
                }
        </div>
        </DialogContent>
    </Dialog>
    </div>

  )
}

export default SearchDropdown