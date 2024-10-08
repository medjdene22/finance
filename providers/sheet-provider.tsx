'use client';

import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
import { useMountedState } from "react-use"

import { EditCatigorieSheet } from "@/features/catigories/components/edit-catigorie-sheet";
import { NewCatigorieSheet } from "@/features/catigories/components/new-catigorie-sheet";

import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet";
import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet";

export const SheetProvider = () => {
  const isMounted = useMountedState();
  if (!isMounted) return null;

  return(
    <>
      <NewAccountSheet/>
      <EditAccountSheet/>
      
      <NewCatigorieSheet/>
      <EditCatigorieSheet/>

      <EditTransactionSheet/>
      <NewTransactionSheet/>
    </>
  )
}

