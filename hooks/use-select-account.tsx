import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
  } from "@/components/ui/dialog"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccounts } from "@/features/accounts/api/use-create-account";
import Select from "@/components/select";


export const useSelectAccount = () : [() => JSX.Element, () => Promise<unknown>] => {

    const accountQuery = useGetAccounts()
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    })) ;
    const accountsmutation = useCreateAccounts();
    const onCreateAccount = (name : string) => accountsmutation.mutate({
        name,
    });


    const [promise, setPromise] = useState< { resolve: (value : string | undefined) => void } | null>(null)

    const selectValue = useRef<string>();

    const confirm = () => new Promise((resolve , reject) => {
        setPromise({resolve});
    });

    const handClose = () => {
        setPromise(null);
    };

    const handelConfirm = ()  => {
        promise?.resolve(selectValue.current);
        handClose()
    }
    const handelCancel = ()  => {
        promise?.resolve(undefined);
        handClose()
    }
    const AccountDialog = ()  => (
        <Dialog open={promise !==null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Account</DialogTitle>
                    <DialogDescription>please select an account to continue.</DialogDescription>
                </DialogHeader>
                <Select placeholder="Select an account" options={accountOptions} onCreate={onCreateAccount}
                  disabled={accountQuery.isLoading || accountsmutation.isPending} 
                 onChange={(value) => selectValue.current =value} />
                <DialogFooter className="pt-2">
                    <Button variant="outline" onClick={handelCancel}>Cancel</Button>
                    <Button variant="destructive" onClick={handelConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent> 
        </Dialog>
    )
    return [AccountDialog, confirm ]
};
