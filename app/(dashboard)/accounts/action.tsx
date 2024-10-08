"use-client"

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account '
import { useDeleteAccount } from '@/features/accounts/api/use-delete-account '
import { useConfirm } from '@/hooks/use-conform'
  

export const Action = ({id} : {id : string}) => {

    const {onOpen} = useOpenAccount();
    const deletemutation = useDeleteAccount(id);
    const [ConfiramtionDialog, confirm] = useConfirm("Are you sure?","you are about to delete this account"); 

    const isDisabled = deletemutation.isPending;

    const onDelete = async () =>{
        const ok = await confirm();
        if (ok) {
            deletemutation.mutate(undefined,)
            
        }
    }
  return (
    <>
        <ConfiramtionDialog/>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className='size-8 p-0'>
                    <MoreHorizontal className='size-4'/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem 
                    disabled={isDisabled}
                    onClick={() => {
                        onOpen(id)
                    }}
                    className='px-auto'>
                    <Edit className='size-4 mr-2 '/> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                    disabled={isDisabled}
                    onClick={onDelete}
                    className='px-auto'>
                    <Trash2 className='size-4 mr-2 '/> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
  )
}
