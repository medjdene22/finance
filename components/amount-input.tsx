import CurrencyInput from "react-currency-input-field"
import { Info, MinusCircle, PlusCircle} from 'lucide-react'
import { cn } from "@/lib/utils"
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
 } from "./ui/tooltip"
import { Button } from "./ui/button"


 type Props = {
    value: string;
    onChange: (value : string | undefined)=> void;
    placeholder?: string;
    disabled?: boolean
}


export function AmountInput({
    value,
    onChange,
    placeholder,
    disabled
} : Props) {

    const parsedValue = parseFloat(value);
    const isIncome = parsedValue > 0;
    const isExpence = parsedValue < 0;

    const onReverseValue = () => {
        if (!value ) return;
        const newValue = (parseFloat(value) * -1);
        onChange(newValue.toString());
    }
    
  return (
    <div className="relative">
        <TooltipProvider>
            
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <Button size='sm' type="button" onClick={onReverseValue} className={cn("bg-slate-400 hover:bg-slate-500 absolute top-0.5 left-1 rounded-md px-3 items-center justify-center transition"
                        ,isIncome && "bg-emerald-500 hover:bg-emerald-600",isExpence && "bg-rose-500 hover:bg-rose-600"
                    )}
                    >
                    {!parsedValue && <Info className="size-3 text-white"/>}
                    {isIncome && <PlusCircle className="size-3 text-white"/>}
                    {isExpence && <MinusCircle className="size-3 text-white"/>}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    [+] for income and [-] for expencess
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <CurrencyInput
        suffix=" DA"
        className="pl-11 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder} value={value} decimalsLimit={2} decimalScale={2} onValueChange={onChange} disabled={disabled}
        />
        <p className="text-xs text-muted-foreground mt-2">
            {isIncome && "this will count as income"}
            {isExpence && "this will count as expence"}
        </p>
    </div>
  )
}
