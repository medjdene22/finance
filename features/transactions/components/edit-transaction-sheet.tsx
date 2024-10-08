import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
  } from "@/components/ui/sheet"
import { TransactionForm } from "./transaction-form";
import { inserttransactionsSchima } from "@/db/schema";
import { z } from "zod";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTtransactions } from "../api/use-delete-transaction ";
import { useOpenTransaction } from "../hooks/use-open-transaction ";
import { useGetTransaction } from "../api/use-get-transaction";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-conform"
import { useCreateAccounts } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateCatigorie } from "@/features/catigories/api/use-create-catigorie";
import { useGetCatigories } from "@/features/catigories/api/use-get-catigories";

export const EditTransactionSheet = () =>{
    
    const formSchema = inserttransactionsSchima.omit({
        id: true,
    })
    
    type FormValues = z.input<typeof formSchema>
    
    const {isOpen, onClose, id} = useOpenTransaction();
    const [ConfiramtionDialog, confirm] = useConfirm("Are you sure?","you are about to delete this Transaction"); 

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

    const transactionQuery = useGetTransaction(id)

    const defaultValues = transactionQuery.data? {
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        amount: transactionQuery.data.amount.toString(),
        payee: transactionQuery.data.payee,
        accountId: transactionQuery.data.accountId,
        notes: transactionQuery.data.notes,
        catigorieId: transactionQuery.data.catigorieId
    } : {
        date: new Date(),
        amount: "",
        payee: "",
        accountId: "",
        notes: "",
        catigorieId: ""
    };
    
    const transactionmutation = useEditTransaction(id);
    const onSubmit = (values : FormValues) =>{
        transactionmutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        }
        );
    }

    const deletemutation = useDeleteTtransactions(id)
    const onDelete = async () =>{
        const ok = await confirm();
        if (ok) {
            deletemutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            })
        }
    }

    const isPending = transactionmutation.isPending || catigoriemutation.isPending || accountsmutation.isPending || deletemutation.isPending
    const isLoading = catigoriesQuery.isLoading || accountsQuery.isLoading || transactionQuery.isLoading

   return(
    <>
        <ConfiramtionDialog/>
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing Transaction.
                    </SheetDescription>
                </SheetHeader>
                {isLoading? (
                    <div className="absolute inset-0 items-center justify-center">
                       <Loader2 className="size-4 text-muted-foreground animate-ping"/>
                    </div>
                ) : (
                    <TransactionForm onSubmit={onSubmit} disable={isPending} id={id}  defaultValues={defaultValues}
                    catigorieOptions={catigorieOptions} accountOptions={accountOptions} onDelete={onDelete}
                    onCreateCatigorie={onCreateCatigorie} onCreateAccount={onCreateAccount}
                    />
                 )}
            </SheetContent>
        </Sheet>
    </>
    )
}