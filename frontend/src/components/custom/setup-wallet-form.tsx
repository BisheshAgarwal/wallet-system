import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SetupWalletForm = ({ onSubmit }) => {
  const usernameRef = useRef(null);
  const balanceRef = useRef(null);

  const submitFormHandler = (e) => {
    e.preventDefault();
    const data = {
      name: usernameRef.current.value,
      balance: +balanceRef.current.value,
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
