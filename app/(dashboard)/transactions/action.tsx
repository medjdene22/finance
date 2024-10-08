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
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction '
import { useDeleteTtransactions } from '@/features/transactions/api/use-delete-transaction '
import { useConfirm } from '@/hooks/use-conform'
  

export const Action = ({id} : {id : string}) => {

    const {onOpen} = useOpenTransaction();
    const deletemutation = useDeleteTtransactions(id);
    const [ConfiramtionDialog, confirm] = useConfirm("Are you sure?","you are about to delete this transaction"); 

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
