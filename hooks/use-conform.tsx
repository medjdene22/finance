import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
  } from "@/components/ui/dialog"


export const useConfirm = (
    title: string,
    message: string
) : [() => JSX.Element, () => Promise<unknown>] => {

    const [promise, setPromise] = useState< { resolve: (value : boolean) => void } | null>(null)
    const confirm = () => new Promise((resolve , reject) => {
        setPromise({resolve});
    });

    const handClose = () => {
        setPromise(null);
    };

    const handelConfirm = ()  => {
        promise?.resolve(true);
        handClose()
    }
    const handelCancel = ()  => {
        promise?.resolve(false);
        handClose()
    }
    const ConfiramtionDialog = ()  => (
        <Dialog open={promise !==null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2">
                    <Button variant="outline" onClick={handelCancel}>Cancel</Button>
                    <Button variant="destructive" onClick={handelConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
    return [ConfiramtionDialog, confirm ]
};
