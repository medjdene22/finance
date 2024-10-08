import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
  } from "@/components/ui/sheet"
import { useNewTransaction } from "../hooks/use-new-transaction"
import { TransactionForm } from "./transaction-form";
import { catigories, inserttransactionsSchima } from "@/db/schema";
import { z } from "zod";
import { useCreateTransaction } from "../api/use-create-transaction";
import { useCreateAccounts } from "@/features/accounts/api/use-create-account";
import { useCreateCatigorie } from "@/features/catigories/api/use-create-catigorie";
import { useGetCatigories } from "@/features/catigories/api/use-get-catigories";
import { Loader2 } from "lucide-react";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

export const NewTransactionSheet = () =>{
    
    const formSchema = inserttransactionsSchima.omit({
        id: true,
    })
    
    type FormValues = z.input<typeof formSchema>
    
    const {isOpen, onClose} = useNewTransaction();

    const accountsmutation = useCreateAccounts();
    const onCreateAccount = (name : string) => accountsmutation.mutate({
        name,
    });
    const accountsQuery = useGetAccounts();
    const accountOptions = (accountsQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    })) ;


    const catigoriemutation = useCreateCatigorie();
    const onCreateCatigorie = (name : string) => catigoriemutation.mutate({
        name,
    });
    const catigoriesQuery = useGetCatigories();
    const catigorieOptions = (catigoriesQuery.data ?? []).map((catigorie) => ({
        label: catigorie.name,
        value: catigorie.id
    })) ;

    
    const transactionmutation = useCreateTransaction();
    const onSubmit = (values : FormValues) =>{
        transactionmutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        }
        );
    }

    const isPending = transactionmutation.isPending || catigoriemutation.isPending || accountsmutation.isPending
    const isLoading = catigoriesQuery.isLoading || accountsQuery.isLoading

    return(
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Add a new transaction
                    </SheetDescription>
                </SheetHeader>
                {isLoading? (
                    <div className="absolute inset-0 items-center justify-center">
                       <Loader2 className="size-4 text-muted-foreground animate-ping"/>
                    </div>
                ) : (
                    <TransactionForm onSubmit={onSubmit} disable={isPending} 
                    catigorieOptions={catigorieOptions} accountOptions={accountOptions} 
                    onCreateCatigorie={onCreateCatigorie} onCreateAccount={onCreateAccount}/>
                )}
                
            </SheetContent>
        </Sheet>
    )
}