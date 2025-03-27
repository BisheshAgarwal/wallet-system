import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData, SetupWalletFormProps } from "@/types";

const SetupWalletForm = ({ onSubmit }: SetupWalletFormProps) => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const balanceRef = useRef<HTMLInputElement>(null);

  const submitFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: FormData = {
      name: usernameRef.current?.value || "",
      balance: +(balanceRef.current?.value || 0),
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={submitFormHandler}>
      <Label className="mb-1">Username</Label>
      <Input
        ref={usernameRef}
        required
        placeholder="john-doe"
        className="mb-3"
      />
      <Label className="mb-1">
        Balance<span className="text-xs text-gray-400 italic">(optional)</span>
      </Label>
      <Input
        ref={balanceRef}
        placeholder="Balance (optional)"
        type="number"
        className="mb-3"
      />
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};

export default SetupWalletForm;
