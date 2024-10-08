'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { transactions as transactionsSchema} from "@/db/schema"
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns"
import { DataTable } from "../../../components/data-table"
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transaction";
import { useState } from "react";
import UploadButton from "./upload-button";
import ImportCard from "./import-card";
import { useSelectAccount } from "@/hooks/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transaction";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT"
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {}
}

export default function Transactions() {

  const [AccountDialog, confirm] = useSelectAccount()
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
  const [importResults, setIimportResults] = useState(INITIAL_IMPORT_RESULTS)
  
  const onUpload = (results :typeof INITIAL_IMPORT_RESULTS) => {
    setIimportResults(results);
    setVariant(VARIANTS.IMPORT);
  }
  const onCancelImport = () => {
    setIimportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  }

  const bulkCreate = useBulkCreateTransactions()
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [] ;
  const {onOpen} = useNewTransaction();

  const deleteTransactions = useBulkDeleteTransactions()

  const isDisable = transactionsQuery.isLoading || deleteTransactions.isPending;

  if (transactionsQuery.isLoading) {
    return(
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">

      <Card className="border-none drop-shadow-sm">
        <CardHeader className="mx-auto">
          <Skeleton className="h-10 w-64 "/>
          <Skeleton className="h-20 w-64"/>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center">
            <Loader2 className="size-6 text-slate-300 animate-spin "/>
          </div>
        </CardContent>
      </Card>

    </div>
    )
  }

  const onSubmitImport = async (values: typeof transactionsSchema.$inferInsert[]) => {
    const accountId = await confirm();
    if (!accountId) {
      return toast.error("Please select an account to continue.")
    }
    const data = values.map((value)=> ({
      ...value,
      accountId: accountId as string
    }))

    bulkCreate.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      }
    })

  } 

  if (variant === VARIANTS.IMPORT) {
    return(
      <>
        <AccountDialog/>
        <ImportCard data={importResults.data} onCancel={onCancelImport} onSubmit={onSubmitImport} />
      </>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">

      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2  lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-3xl line-clamp-1">Transactions Page</CardTitle>

          <div className="flex items-center gap-x-2">
            <Button onClick={onOpen} size='sm' className="w-full lg:w-auto">
              <Plus className="size-4 mr-2"/> 
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
          
        </CardHeader>
        <CardContent>

          <DataTable columns={columns} data={transactions} filterKey="payee" disabled={isDisable}
            onDelete={(row) => {
              const ids =row.map( r => r.original.id);
              deleteTransactions.mutate({ids})
            }} />

        </CardContent>
      </Card>

    </div>
  );
}
