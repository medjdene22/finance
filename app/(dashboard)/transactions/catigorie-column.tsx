"use client"
import { useOpenCatigorie } from "@/features/catigories/hooks/use-open-catigorie";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction ";
type Props= {
  id: string;
  catigorie: string | null ;
  catigorieId: string | null;
}

export default function CatigorieColumn({
  id,
  catigorie,
  catigorieId,
} : Props) {

  const {onOpen : onOpenTransaction} = useOpenTransaction();
  const {onOpen : onOpenCatigorie} = useOpenCatigorie();
  const onClick=() => {
    if (catigorieId) {
      onOpenCatigorie(catigorieId)
    }else{
      onOpenTransaction(id)
    }
  }

  return (
    <div className={cn("flex items-center cursor-pointer hover:underline", !catigorie && "text-red-500", )} onClick={onClick}>
      {!catigorie && <TriangleAlert className="size-4 mr-2 shrink-0"/>}
      {catigorie || "Uncategorized"}
    </div>
  )
}
