import { ReactNode } from "react";
import { cn } from "../../@/lib/utils";
export function TypographyH3({className='',children}:{className:string|undefined,children:ReactNode}) {
    return (
      <h3 className={cn(className,'scroll-m-20 text-2xl font-semibold tracking-tight')}>
        {children}
      </h3>
    )
  }

export function TypographyList({className='',children}:{className:string|undefined,children:ReactNode}) {
    return (
    <ol className={cn(className,"my-6 ml-6 [&>li]:mt-4 list-decimal")}>
        {children}
    </ol>
    )
}
