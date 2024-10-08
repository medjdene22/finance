import { z } from "zod"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

import { insertCatigorieSchima } from '@/db/schema'

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

const formSchema = insertCatigorieSchima.pick({
    name: true,
})

type FormValues = z.input<typeof formSchema>

type Props = {
    id?: string,
    defaultValues?: FormValues,
    onSubmit: (values : FormValues) => void,
    onDelete?: () => void,
    disable?: boolean
};


export const CatigorieForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disable
}:Props ) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values)
    }

    const handelDelete = () => {
        onDelete?.() 
    }
 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <FormField name="name" control={form.control} render={({field}) => (

          <FormItem>
            <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={disable} placeholder="e.g. Food ,tax" {...field} />
              </FormControl>
              <FormMessage />
          </FormItem>

        )}
        />

        <Button className="w-full" disabled={disable} type="submit">{id? "Save change" : "Create Catigorie"}</Button>
        {!!id &&
        <Button type="button" disabled={disable} onClick={handelDelete} className="w-full" variant='destructive' >
          <Trash className="size-4"/>
            <p className="pl-2">Delete Catigorie</p>
        </Button>}

      </form>

    </Form>
  )
}

