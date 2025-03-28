
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
 
import { Button } from '../../@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../@/components/ui/form'
import { Input } from '../../@/components/ui/input';
import {
  MultiStepForm,
  MultiStepFormContextProvider,
  MultiStepFormHeader,
  MultiStepFormStep,
  createStepSchema,
  useMultiStepFormContext,
} from '../../@/components/ui/multi-step-form';
import Stepper from './Stepper';
import { ArrowLeft, Check, Clipboard } from 'lucide-react';
import CryptoPayment from './CryptoPayment';
import { useState } from 'react';
import { createPaymentID } from '../firebase/firebaseUtils';
import { getMoneroPrice } from '../utils';
import { ClipLoader } from 'react-spinners';
import SearchDropdown from './SearchDropdown';
import { Label } from '../../@/components/ui/label';
import { byer, representantdata } from '../data';
import { NavLink } from 'react-router-dom';

import sessionlogo from '../public/session_logo.webp'
import CopyToClipboard from 'react-copy-to-clipboard';
const FormSchema = createStepSchema({
  zodemail: z.object({
    email: z.string().email(),
  }),
  zodpaymentid: z.object({
    id: z.string(),
    amountmonero: z.string()
  }),
  zodcity: z.object({
    zodcity:z.string().min(2)
  }),
});
 
type FormValues = z.infer<typeof FormSchema>;
 
export function MultiStepFormCrypto() {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      zodemail: {
        email: '',
      },
      zodpaymentid: {
        id: '',
        amountmonero:''
      },
    },
    reValidateMode: 'onBlur',
    mode: 'onBlur',
  });
 
  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
  };
 
  return (
    <MultiStepForm
      className={'space-y-10 p-6 py-8 rounded-xl border'}
      schema={FormSchema}
      form={form}
      onSubmit={onSubmit}
    >
      <MultiStepFormHeader
        className={'flex w-full flex-col justify-center space-y-6'}
      >
        <MultiStepFormContextProvider>
          {({ currentStepIndex }:{currentStepIndex:number}) => (
            <>
            <h2 className={'text-xl font-bold flex flex-col gap-2'}><div>Betal med Crypto</div>
            <div className='text-gray-600 underline' >500Kr for 3 Måneder</div>
            </h2>
            {
              (currentStepIndex===0 || currentStepIndex===1)&&
              
              <p className=' text-gray-500 text-sm font-medium '>Din email brukes kun til å sende tilgangs-kode.
              Den vil bli <span className=' font-bold'>slettet for alltid</span> fra vår database etter <span className=' font-bold'>24 timer</span>.</p>
              
            }
             
            <Stepper
              steps={['Email','Bekreft', 'Betal']}
              rows={2}
              currentStep={currentStepIndex}
            />
            </>
          )}
          </MultiStepFormContextProvider>
      </MultiStepFormHeader>
 
      <MultiStepFormStep name="zodemail">
        <EnterEMailStep />
      </MultiStepFormStep>
      <MultiStepFormStep >
        <ConfirmEMailStep />
      </MultiStepFormStep>
      <MultiStepFormStep name="review">
        <SendCryptoStep />
      </MultiStepFormStep>
 
    </MultiStepForm>
  );
}
export function MultiStepFormKontanter() {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      zodemail: {
        email: '',
      },
      zodpaymentid: {
        id: '',
        amountmonero:''
      },
      zodcity:{
        zodcity:''
      }
    },
    reValidateMode: 'onBlur',
    mode: 'onBlur',
  });
 
  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
  };
 
  return (
    <MultiStepForm
      className={'space-y-10 p-6 py-8 rounded-xl border'}
      schema={FormSchema}
      form={form}
      onSubmit={onSubmit}
    >
      <MultiStepFormHeader
        className={'flex w-full flex-col justify-center space-y-6'}
      >

        <MultiStepFormContextProvider>
          {({ currentStepIndex }:{currentStepIndex:number}) => (
            <>
            <h2 className={'text-xl font-bold flex flex-col gap-2'}><div>Betal med Kontanter</div>
            <div className='text-gray-600 underline' >800Kr for 3 Måneder</div>
            </h2>

            

             
            <Stepper
              steps={['Område', 'Verifiser', 'Chat']}
              rows={2}
              currentStep={currentStepIndex}
            />
            {
              (currentStepIndex===0 )&&
              
              <p className=' text-gray-500 text-sm font-medium '>
                Velg hvilke område du ønsker at transaksjonen skal foregå. 
                Vi kobler deg opp med en representant derfra.
                
                </p>
              
            }
            </>
          )}
        </MultiStepFormContextProvider>
      </MultiStepFormHeader>

      <MultiStepFormStep name='zodcity'>
        <LocationStep />
      </MultiStepFormStep>

      <MultiStepFormStep >
        <ConfirmLocationStep />
      </MultiStepFormStep>

 
      <MultiStepFormStep name="profile">
        <SendKontanterStep />
      </MultiStepFormStep>
 
    </MultiStepForm>
  );
}

function EnterEMailStep() {
  const { form, nextStep, isStepValid } = useMultiStepFormContext();
 
  return (
    <Form {...form}>
      <div className={'flex flex-col gap-4'}>
        <FormField
          name="zodemail.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          
          <Button onClick={(e)=>{
            nextStep(e)
          }} disabled={!isStepValid()}>
            Neste
          </Button>
        </div>
      </div>
    </Form>
  );
}
function ConfirmEMailStep() {
  const { form, nextStep,prevStep } = useMultiStepFormContext();
  const values = form.getValues();
  const [loading, setloading] = useState(false)
  async function handleonclick(e:React.SyntheticEvent<Element, Event>) {
      setloading(true)
      const id = await createPaymentID(values.zodemail.email)
      form.setValue('zodpaymentid.id',id.data.paymentId)
      const price = await getMoneroPrice()
      const amountmonero = 50/Number(price['USD'])
      form.setValue('zodpaymentid.amountmonero',amountmonero)
      setloading(false)
      nextStep(e)
  }
  return (    
      <div className={'flex flex-col gap-4'}>
        <p className=' text-orange-500 text-sm'>
          Viktig! Tilgangskoden sendes til oppgitt e-post etter betaling. 
          Sørg for at adressen er korrekt og tilgjengelig.
        </p>
        
          <Input  value={values.zodemail.email} disabled/>
              
 
        <div className="flex justify-between">
          <Button type={'button'} className=' flex gap-1' variant={'outline'} onClick={prevStep}>
            <ArrowLeft size={16}/> <div>Tilbake</div>
          </Button>
          <Button disabled={loading} onClick={(e)=>{
              handleonclick(e as React.SyntheticEvent<Element, Event>)
          }} >
            {
              loading?
              <ClipLoader size={18} className=' mx-12 ' color='black'/>
              :
              <div>Generer Payment ID</div>
            }
          
          </Button>
        </div>
      </div>
  );
}
 
function ConfirmLocationStep() {
  const { form, nextStep,prevStep } = useMultiStepFormContext();
  const values = form.getValues();
  const city = values.zodcity.zodcity as 'Alta'
  return (    
      <div className={'flex flex-col gap-4'}>
        {
          (byer[city])?
          <p className=' text-blue-500 text-sm'>
            Det finnes 1 eller flere Representanter i ditt område!
        </p>
        :
        <p className=' text-destructive text-sm'>
          Det finnes ingen representanter i ditt område, velg et annet område eller betal med crypto.
        </p>
        }
        <div className="flex justify-between">
          <Button type={'button'} className=' flex gap-1' variant={'outline'} onClick={prevStep}>
            <ArrowLeft size={16}/> <div>Tilbake</div>
          </Button>
          <Button disabled={!byer[city]} onClick={nextStep}>
              Åpne Chat
          </Button>
        </div>
      </div>
  );
}
 
function SendCryptoStep() {
  const { form, prevStep } = useMultiStepFormContext();
  const values = form.getValues();
  return (
    <Form {...form}>
      <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-col space-y-2 text-sm'}>
          <div>
            
            <p className=' text-blue-500'>Når vi hat motatt og prosesert betaling,
               vil vi sende tilgangskoden til <span className=' font-semibold'>{values.zodemail.email}</span></p>
          </div>
        </div>
        <CryptoPayment paymentID={values.zodpaymentid.id} amount={values.zodpaymentid.amountmonero}/>
        
        <div className="flex justify-between space-x-2 items-center">
          <NavLink className='text-sm text-muted-foreground underline' to={`/support?mail=${values.zodemail.email}`}>Support</NavLink>
          <Button type={'button'} variant={'outline'} onClick={prevStep}>
            Tilbake
          </Button>
 
        </div>
      </div>
    </Form>
  );
}
function SendKontanterStep() {
  const { form, prevStep } = useMultiStepFormContext();
  const [copiedid, setcopiedid] = useState(false)
  const values = form.getValues();
  const city = values.zodcity.zodcity as 'Oslo'
  const representant = representantdata[city]
  return (
    <Form {...form}>
      <div className={'flex flex-col gap-4'}>
       <div className=' w-full space-x-2 flex flex-col items-center'>
        <div className=' flex flex-col-reverse gap-2 items-center justify-center w-10/12 h-fit'>
          <span className=' text-lg font-medium text-center'  >
            Legg til vår representant fra {city}, på Session for mer detaljer.
          </span> <img src={sessionlogo} className=' h-6' />
        </div>
        <p className=' text-sm mt-4'>Scan Qr kode</p>
        <img src={representant.img} className=' w-6/12' alt="" />
        <p className=' text-sm mt-4 mb-2'>Eller bruk Account ID</p>
        <CopyToClipboard text={representant.id}
            onCopy={() => setcopiedid(true)}>
            <div className=' break-all items-center flex h-fit w-10/12 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'>        
                <div className=' flex w-full justify-between relative text-center '>
                    <div>{representant.id}</div>
                    <div className='absolute h-fit w-fit bg-white p-1 right-0 top-0'>
                      {
                        copiedid?
                        <Check size={16} className='  ' color='grey'/>
                        :
                        <Clipboard size={16} className=' ' color='grey' />
                      }
                    </div>
                </div>
                
            </div>
          </CopyToClipboard>


       </div>
 
        <div className="flex justify-end space-x-2">
          <Button type={'button'} variant={'outline'} onClick={prevStep}>
            Tilbake
          </Button>
 
        </div>
      </div>
    </Form>
  );
}
function LocationStep() {
  const { form, nextStep } = useMultiStepFormContext();
  const [selected, setselected] = useState('')
  
  return (
    <Form {...form}>
      <div className={'flex flex-col gap-4'}>
       <div className='flex gap-2 items-end mb-2 relative'>
       <SearchDropdown setselected={setselected}/>
       <FormField
       
          name="zodcity.zodcity"
          render={({ field }) => (
            <FormItem className=' h-full flex flex-col gap-0'>
              <Label >{selected?'Du har valgt':'Ingen by valgt'}</Label>
              <FormControl>
                <Input  {...field} value={`${selected}`} disabled />
              </FormControl>
            </FormItem>
          )}
        />
       </div>
        <div className="flex justify-end space-x-2">
 
          <Button onClick={(e)=>{

            form.setValue('zodcity.zodcity',selected)
            nextStep(e)
          }} disabled={!selected}>Neste</Button>
        </div>
      </div>
    </Form>
  );
}

