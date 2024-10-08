"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { client } from "@/lib/hono"
import { InferResponseType } from "hono"
import { Action } from "./action"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import AccountColumn from "./account-column"
import CatigorieColumn from "./catigorie-column"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0]


export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  
  {
    accessorKey: 'date',
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>

    
          </div>
          
        )
      },
      cell:({row}) => {
        const date = row.getValue("date") as Date;
        return(
          <span>{format(date, "dd MMMM, yyyy")}</span>
        )
      }
  },
  {
    accessorKey: 'catigorie',
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Catigorie
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
        )
      },
      cell:({row}) => {
        return(
          <CatigorieColumn id={row.original.id} catigorie={row.original.catigorie} catigorieId={row.original.catigorieId} />
        )
      }
  },
  {
    accessorKey: 'payee',
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Payee
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>

    
          </div>
          
        )
      },
      cell:({row}) => {
        return(
          <span>{row.original.payee}</span>
        )
      }
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>

    
          </div>
          
        )
      },
      cell:({row}) => {
        const amount = row.original.amount;
        
        return(
          <Badge
          variant={amount < 0 ? 'destructive' : 'primary'} 
          className="text-xs font-medium px-3.5 py-2"
          >{formatCurrency(amount)}</Badge>
        )
      }
  },
  {
    accessorKey: 'account',
    header: ({ column }) => {
        return (
          <div>
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Account
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell:({row}) => {
        return (
        <AccountColumn  account={row.original.account} accountId={row.original.accountId} />
        )

      }
  },
  {
    id: "actions",
    cell: ({ row }) => <Action id={row.original.id} />
  }
]
