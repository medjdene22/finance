import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
  } from "@/components/ui/sheet"
import { useNewAccount } from "../hooks/use-new-account"
import { AccountForm } from "./account-form";
import { insertAccountSchima } from "@/db/schema";
import { z } from "zod";
import { useCreateAccounts } from "../api/use-create-account";

export const NewAccountSheet = () =>{
    
    const formSchema = insertAccountSchima.pick({
        name: true,
    })
    
    type FormValues = z.input<typeof formSchema>
    
    const {isOpen, onClose} = useNewAccount();

    const mutation = useCreateAccounts();

    const onSubmit = (values : FormValues) =>{
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        }
        );
    }

    return(
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <AccountForm onSubmit={onSubmit} disable={mutation.isPending}/>
            </SheetContent>
        </Sheet>
    )
}