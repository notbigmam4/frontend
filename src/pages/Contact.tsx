const Contact = () => {
  return (
    <div>
      nope
    </div>
  )
}
export default Contact
// import { MultiStepFormCrypto,MultiStepFormKontanter } from "../components/MultiStepForm"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../@/components/ui/tabs"
// import { TypographyH3 } from "../components/Typography"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../../@/components/ui/accordion"


// const Contact = () => {
//   return (
//     <div className=' w-screen h-fit flex flex-col items-center  gap-3 pb-8 '>
//             <Tabs defaultValue="crypto" className="max-w-[500px] w-full flex items-center flex-col ">
//               <TabsList className="mt-12 mb-6" >
//                 <TabsTrigger value="crypto" className=" relative">Betal med Crypto
//                    <div className=" text-[10px] px-2 data-[state=active]:text-xl rounded-full absolute bg-blue-600 text-white left-[-30px] top-[-10px] -rotate-45">
//                     SPAR 37%
//                     </div>
//                 </TabsTrigger>
//                 <TabsTrigger value="kontanter">Betal med kontanter</TabsTrigger>
//               </TabsList>
//               <TabsContent value="crypto">
//                 <MultiStepFormCrypto />
//                 <TypographyH3 className=" mt-12 mb-6">
//                   Hvordan funker det?
//                 </TypographyH3>
//                 <h5 className="text-lg font-bold mb-1.5">E-postadresse </h5>
//                   <p className="text-sm">
//                     E-posten din brukes kun til å sende tilgangskoden etter at vi har mottatt betalingen, og den vil slettes automatisk fra vår database etter 24 timer.
//                     Det er avgjørende at du har tilgang til oppgitt e-poste, da det ikke finnes andre måter å motta koden på.
//                   </p>

//                   <h5 className="text-lg font-bold mb-1.5 mt-6">Slik sender du Monero til vår wallet</h5>
//                   <p className="text-sm">
//                     Du kan bruke MyMonero-appen eller en hvilken som helst annen Monero-wallet for å sende betaling. Når du kommer til betalingssiden, vil du motta følgende informasjon:
//                     <span className="font-semibold"> Beløp, </span> 
//                     <span className="font-semibold">Mottakeradresse, </span> 
//                     <span className="font-semibold">Betalings-ID. </span>
//                   </p>
//                   <p className="text-sm mt-4">
//                     For MyMonero-brukere: Logg inn på MyMonero-appen på PC eller mobil, velg "Send Crypto", og fyll inn informasjonen du har mottatt på betalingssiden. Når betalingen er sendt, tar det vanligvis 10-60 minutter før vi mottar den.
//                   </p>
//                   <p className="text-sm mt-4">
//                     Hvis du bruker en annen Monero-wallet, følger du tilsvarende trinn: Fyll inn beløpet, mottakeradressen og betalings-IDen som er oppgitt på betalingssiden.
//                   </p>

//                   <h5 className="text-lg font-bold mb-1.5 mt-6">Etter betaling</h5>
//                   <p className="text-sm">
//                     Når vi hat motatt og prosesert betaling,, vil du få tilsendt en tilgangskode på e-posten du har oppgitt. Deretter sletter vi e-posten din fra databasen vår.
//                   </p>

//                   <h5 className="text-lg font-bold mb-1.5 mt-6">Etter du har mottatt tilgangskoden</h5>
//                   <p className="text-sm">
//                     Når du mottar tilgangskoden, kan du logge inn på tjenesten fra landingssiden. Ved første innlogging må du oppgi informasjon som skal vises på din test-ID. 
//                     <span className="font-semibold"> Bilde, </span>
//                     <span className="font-semibold">Fullt navn og </span> 
//                     <span className="font-semibold">Fødselsdato. </span>
//                     Når all informasjon er gitt og vilkårene for bruk er akseptert, kan du begynne å bruke tjenesten.
//                   </p>
//                 <TypographyH3 className=" mt-8">
//                   FAQ
//                 </TypographyH3>
//                 <Accordion type="single" collapsible className="w-full mb-8">
//                   <AccordionItem value="item-1">
//                     <AccordionTrigger>Hvor lang tid før jeg mottar engangskoden?</AccordionTrigger>
//                     <AccordionContent>
//                     <span className=" font-bold">30-60 minutter</span> 
//                     <br />
//                       Det tar vanligvis 10-30 minutter for at cryptoen skal sendes
//                        og 30 minutter for oss å behandle bestillingen. Så mellom 30-60 minutter.
//                     </AccordionContent>
//                   </AccordionItem>
//                   <AccordionItem value="item-2">
//                     <AccordionTrigger>Er det anonymt?</AccordionTrigger>
//                     <AccordionContent>
//                     <span className=" font-bold">Ja, fullstendig anonymt</span> 
//                     <br />
//                     Anonymitet er vår høyeste prioritet, Betaling ved Monero er gullstandarn når
//                        det kommer til anonyme online-betalinger, så der trenger man ikke bekymre seg. Vi lagrer ingen info om deg.
//                        infoen som skal vises på din test-ID derimot må lagres for brukervennlighet,
//                         den krypteres og lagres sikkert, du kan også slette denne infoen når som helst.
//                     </AccordionContent>
//                   </AccordionItem>
//                   <AccordionItem value="item-3">
//                     <AccordionTrigger>Hvor stabil er tjenesten?</AccordionTrigger>
//                     <AccordionContent>
//                     <span className=" font-bold">Tjenesten har hatt 100% oppetid i
//                        løpet av de siste 6 månedene</span> 
//                     <br />

//                     </AccordionContent>
//                   </AccordionItem>
//                   <AccordionItem value="item-4">
//                     <AccordionTrigger>Jeg har ikke MyMonero konto.</AccordionTrigger>
//                     <AccordionContent>
//                     <span className=" font-bold">Du kan bruke hvordan som helst Monero wallet eller sette opp en MyMonero konto helt enkelt på 5 min. I tilleg kan betale med kontant</span> 
//                     <br />
                    
//                     </AccordionContent>
//                   </AccordionItem>
//                 </Accordion>
//               </TabsContent>
//               <TabsContent value="kontanter">
//                 <MultiStepFormKontanter />
//                 <TypographyH3 className=" mt-12 mb-6">
//                   Hvordan funker det?
//                 </TypographyH3>
//                 <h5 className="text-lg font-bold mb-1.5">Velg lokasjon </h5>
//                   <p className="text-sm">
//                   Først velger du din lokasjon ved å taste inn din by, dette gjøres for
//                    å sjekke om det er mulig å betale med kontanter der du befinner deg.</p>
//                   <h5 className="text-lg font-bold mb-1.5 mt-6">Privat chat på Session</h5>
//                   <p className="text-sm">
//                   Hvis kontantbetaling er tilgjengelig på din lokasjon, 
//                   blir du koblet til en av våre representanter via privat chat.
//                    Vi benytter Session.org til kommunikasjon for å sørge for at meldingene er privat. 
//                    Der blir vi også enige om detaljer for transaksjonen.
//                   </p>

//                   <h5 className="text-lg font-bold mb-1.5 mt-6">Etter du har mottatt tilgangskoden</h5>
//                   <p className="text-sm">
//                     Når du mottar tilgangskoden, kan du logge inn på tjenesten fra landingssiden. Ved første innlogging må du oppgi informasjon som skal vises på din test-ID. 
//                     <span className="font-semibold"> Bilde, </span>
//                     <span className="font-semibold">Fullt navn og </span> 
//                     <span className="font-semibold">Fødselsdato. </span>
//                     Når all informasjon er gitt og vilkårene for bruk er akseptert, kan du begynne å bruke tjenesten.
//                   </p>
//               </TabsContent>
//             </Tabs>

            
//         </div>
//   )
// }

// export default Contact

