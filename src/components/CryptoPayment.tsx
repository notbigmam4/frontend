import { useEffect, useState } from 'react'

import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Check, Clipboard } from 'lucide-react';

const CryptoPayment = ({paymentID,amount}:{paymentID:string,amount:string}) => {
    const [copydamount, setcopydamount] = useState<boolean>(false)
    const [copydwallet, setcopydwallet] = useState<boolean>(false)
    const [copydpaymentid, setcopydpaymentid] = useState<boolean>(false)
    
    const WALLET = '46Dsf2uraveU3FMXXFPXWXX4gcUNvVninbX4zjuT58frXfP12Ua82vvfxku3x8pD4G9KRvgqh9Z9wSa83XpLS39nU1q3mU3'
    useEffect(()=>{
      setTimeout(() => {
        setcopydwallet(false)
      }, 5000);
    },[copydwallet])
    useEffect(()=>{
      setTimeout(() => {
        setcopydamount(false)
      }, 5000);
    },[copydamount])
    useEffect(()=>{
      setTimeout(() => {
        setcopydpaymentid(false)
      }, 5000);
    },[copydpaymentid])
  return (
    <div className=' flex flex-col gap-3'>
        
        <div className=' flex flex-col gap-1'>
          <p className=' text-sm text-muted-foreground ml-0.5'>Amount in XMR ~500 kr</p>
          <CopyToClipboard text={amount}
            onCopy={() => setcopydamount(true)}>
            <div className=' items-center flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>        
                <div className=' flex w-full justify-between'>
                    <div>{amount}</div>
                    {
                      copydamount?
                      <Check size={16} color='grey'/>
                      :
                      <Clipboard size={16} color='grey' />
                    }
                </div>
                
            </div>
          </CopyToClipboard>
        </div>

        <div className=' flex flex-col gap-1'>
          <p className=' text-sm text-muted-foreground ml-0.5'>Adress</p>
          <CopyToClipboard text={WALLET}
            onCopy={() => setcopydwallet(true)}>
            <div className=' break-all items-center flex h-fit w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>        
                <div className=' flex w-full justify-between relative '>
                    <div>{WALLET}</div>
                    <div className='absolute h-fit w-fit bg-white p-1 right-0 top-0'>
                      {
                        copydwallet?
                        <Check size={16} className='  ' color='grey'/>
                        :
                        <Clipboard size={16} className=' ' color='grey' />
                      }
                    </div>
                </div>
                
            </div>
          </CopyToClipboard>
        </div>
        <div className=' flex flex-col gap-1'>
          <p className=' text-sm text-muted-foreground ml-0.5'>Payment ID</p>
          <CopyToClipboard text={paymentID}
            onCopy={() => setcopydpaymentid(true)}>
            <div className=' items-center flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>        
                <div className=' flex w-full justify-between'>
                    <div>{paymentID}</div>
                    {
                      copydpaymentid?
                      <Check size={16} color='grey'/>
                      :
                      <Clipboard size={16} color='grey' />
                    }
                </div>
                
            </div>
          </CopyToClipboard>
        </div>
    </div>
  )
}

export default CryptoPayment