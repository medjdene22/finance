'use client';

import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

export default function Home() {
  const {onOpen} = useNewAccount();

  return (
    <div>
      <h1>Dashboaed page</h1>
      <Button onClick={onOpen}>Add Account</Button>
    </div>
  );
}
