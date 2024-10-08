import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
  } from "@/components/ui/sheet"
import { AccountForm } from "./account-form";
import { insertAccountSchima } from "@/db/schema";
import { z } from "zod";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete-account ";
import { useOpenAccount } from "../hooks/use-open-account ";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-conform"

export const EditAccountSheet = () =>{
    
    const formSchema = insertAccountSchima.pick({
        name: true,
    })
    
    type FormValues = z.input<typeof formSchema>
    
    const {isOpen, onClose, id} = useOpenAccount();
    const [ConfiramtionDialog, confirm] = useConfirm("Are you sure?","you are about to delete this account"); 

    const accountQuery = useGetAccount(id); 
    const editmutation = useEditAccount(id);
    const deletemutation = useDeleteAccount(id);

    const isPending = editmutation.isPending || deletemutation.isPending ;
    const isLoading = accountQuery.isLoading; 

    const defaultValues = accountQuery.data? {
        name: accountQuery.data.name,
    } : {
        name: ""
    };

    const onSubmit = (values : FormValues) =>{
        editmutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        }
        );
    }
    
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

    return(
    <>
        <ConfiramtionDialog/>
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Account
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing account.
                    </SheetDescription>
                </SheetHeader>
                {isLoading? (
                    <div className="absolute inset-0 items-center justify-center">
                       <Loader2 className="size-4 text-muted-foreground animate-ping"/>
                    </div>
                ) : (
                    <AccountForm onSubmit={onSubmit} disable={isPending} defaultValues={defaultValues} id={id} onDelete={onDelete}/>
                )}
            </SheetContent>
        </Sheet>
    </>
    )
}