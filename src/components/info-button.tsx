import { cn } from '../../@/lib/utils';
import React from 'react'

type ButtonProps = React.PropsWithChildren<{
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}>;

const InfoButton: React.FC<ButtonProps> = ({ onClick, className, disabled, children }) => {
    return (
        <button onClick={onClick} className={cn(' border-[#444E55] border-[1px] border-l-[3px] px-1 bg-white',className)} disabled={disabled}>
            {children}
        </button>
    );
};

export default InfoButton;