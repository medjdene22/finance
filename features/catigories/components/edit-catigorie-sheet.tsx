import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
  } from "@/components/ui/sheet"
import { CatigorieForm } from "./catigorie-form";
import { insertCatigorieSchima } from "@/db/schema";
import { z } from "zod";
import { useEditCatigorie } from "../api/use-edit-catigorie";
import { useDeleteCatigorie } from "../api/use-delete-catigorie ";
import { useOpenCatigorie } from "../hooks/use-open-catigorie";
import { useGetCatigorie } from "../api/use-get-catigorie";
import { Loader2 } from "lucide-react";
import { useConfirm } from "../../../hooks/use-conform"

export const EditCatigorieSheet = () =>{
    
    const formSchema = insertCatigorieSchima.pick({
        name: true,
    })
    
    type FormValues = z.input<typeof formSchema>
    
    const {isOpen, onClose, id} = useOpenCatigorie();
    const [ConfiramtionDialog, confirm] = useConfirm("Are you sure?","you are about to delete this catigorie"); 

    const catigorieQuery = useGetCatigorie(id); 
    const editmutation = useEditCatigorie(id);
    const deletemutation = useDeleteCatigorie(id);

    const isPending = editmutation.isPending || deletemutation.isPending ;
    const isLoading = catigorieQuery.isLoading; 

    const defaultValues = catigorieQuery.data? {
        name: catigorieQuery.data.name,
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
                        Edit Catigories
                    </SheetTitle>
                    <SheetDescription>
                        Edit an existing catigorie.
                    </SheetDescription>
                </SheetHeader>
                {isLoading? (
                    <div className="absolute inset-0 items-center justify-center">
                       <Loader2 className="size-4 text-muted-foreground animate-ping"/>
                    </div>
                ) : (
                    <CatigorieForm onSubmit={onSubmit} disable={isPending} defaultValues={defaultValues} id={id} onDelete={onDelete}/>
                )}
            </SheetContent>
        </Sheet>
    </>
    )
}