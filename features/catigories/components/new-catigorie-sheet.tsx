import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
  } from "@/components/ui/sheet"
import { useNewCatigorie } from "../hooks/use-new-catigorie"
import { CatigorieForm } from "./catigorie-form";
import { insertCatigorieSchima } from "@/db/schema";
import { z } from "zod";
import { useCreateCatigorie } from "../api/use-create-catigorie";

export const NewCatigorieSheet = () =>{
    
    const formSchema = insertCatigorieSchima.pick({
        name: true,
    })
    
    type FormValues = z.input<typeof formSchema>
    
    const {isOpen, onClose} = useNewCatigorie();

    const mutation = useCreateCatigorie();

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
                        New Catigorie
                    </SheetTitle>
                    <SheetDescription>
                        Create a new catigorie to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CatigorieForm onSubmit={onSubmit} disable={mutation.isPending}/>
            </SheetContent>
        </Sheet>
    )
}