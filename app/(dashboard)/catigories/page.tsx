'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNewCatigorie } from "@/features/catigories/hooks/use-new-catigorie";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns"
import { DataTable } from "../../../components/data-table"
import { useGetCatigories } from "@/features/catigories/api/use-get-catigories";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteCatigories } from "@/features/catigories/api/use-bulk-delete-catigorie";

export default function Catigories() {

  const catigoriesQuery = useGetCatigories();
  const catigories = catigoriesQuery.data || [] ;
  const {onOpen} = useNewCatigorie();

  const deleteCatigories = useBulkDeleteCatigories()

  const isDisable = catigoriesQuery.isLoading || deleteCatigories.isPending;

  if (catigoriesQuery.isLoading) {
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

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">

      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2  lg:flex-row lg:items-center lg:justify-between">

          <CardTitle className="text-3xl line-clamp-1">Catigories Page</CardTitle>
          <Button onClick={onOpen} size='sm'>
            <Plus className="size-4 mr-2"/> 
             Add new
            
          </Button>

        </CardHeader>
        <CardContent>

          <DataTable columns={columns} data={catigories} filterKey="name" disabled={isDisable}
            onDelete={(row) => {
              const ids =row.map( r => r.original.id);
              deleteCatigories.mutate({ids})
            }} />

        </CardContent>
      </Card>

    </div>
  );
}
