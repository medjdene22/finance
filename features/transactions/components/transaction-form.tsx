import { z } from "zod"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

import { accounts, inserttransactionsSchima } from '@/db/schema'
import { AmountInput } from "@/components/amount-input";
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
  } from "@/components/ui/form"
import { BaseSyntheticEvent, ReactElement } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select from "@/components/select";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { convertAmountToMili } from "@/lib/utils";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  catigorieId: z.string().nullable().optional(),
  amount: z.string(),
  payee: z.string(),
  notes: z.string().nullable().optional(),
})
const apiformSchema = inserttransactionsSchima.omit({
  id: true
})

type FormValues = z.input<typeof formSchema>
type ApiFormValues = z.input<typeof apiformSchema>

type Props = {
    id?: string,
    defaultValues?: FormValues,
    onSubmit: (values : ApiFormValues) => void
    onDelete?: () => void,
    disable?: boolean,
    accountOptions: { label: string; value: string; }[],
    catigorieOptions: { label: string; value: string; }[],
    onCreateCatigorie: (name: string) => void,
    onCreateAccount: (name: string) => void,
};


export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disable,
    accountOptions,
    catigorieOptions,
    onCreateCatigorie,
    onCreateAccount,
}:Props ) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
      const amount = parseFloat(values.amount)
      const amountInMili = convertAmountToMili(amount)
      onSubmit({...values, amount: amountInMili})
    }

    const handelDelete = () => {
        onDelete?.() 
    }
 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        
        <FormField name="date" control={form.control} render={({field}) => (
          <FormItem>
              <FormControl>
                <DatePicker  disabled={disable} 
                value={field.value} onChange={field.onChange}/>
              </FormControl>
              <FormMessage />
          </FormItem>
        )}
        />
        <FormField name="accountId" control={form.control} render={({field}) => (
          <FormItem>
            <FormLabel>Account</FormLabel>
              <FormControl>
                <Select placeholder="Select an account" options={accountOptions} disabled={disable} 
                value={field.value} onChange={field.onChange} onCreate={onCreateAccount}/>
              </FormControl>
              <FormMessage />
          </FormItem>
        )}
        />
        <FormField name="catigorieId" control={form.control} render={({field}) => (
          <FormItem>
            <FormLabel>Catigorie</FormLabel>
              <FormControl>
                <Select placeholder="Select a catigorie" options={catigorieOptions} disabled={disable} 
                value={field.value} onChange={field.onChange} onCreate={onCreateCatigorie}/>
              </FormControl>
              <FormMessage />
          </FormItem>
        )}
        />
        <FormField name="payee" control={form.control} render={({field}) => (
          <FormItem>
            <FormLabel>Payee</FormLabel>
            <FormControl>
              <Input disabled={disable} placeholder="add a payee" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        />
        <FormField name="amount" control={form.control} render={({field}) => (
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <AmountInput {...field} disabled={disable} placeholder="0.00"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        />
        <FormField name="notes" control={form.control} render={({field}) => (

          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea {...field} value={field.value ?? ""} disabled={disable} placeholder="Optional nots"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        />
        
        <Button className="w-full" disabled={disable} type="submit">{id? "Save change" : "Craete Transaction"}</Button>
        {!!id &&
        <Button type="button" disabled={disable} onClick={handelDelete} className="w-full" variant='destructive' >
          <Trash className="size-4"/>
            <p className="pl-2">Delete transaction</p>
        </Button>}

      </form>

    </Form>
  )
    
}

