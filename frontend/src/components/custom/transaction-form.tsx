import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "../ui/button";

const TransactionForm = ({ onSubmit }) => {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("credit");
  const [description, setDescription] = useState("");

  const submitFormHandler = (e) => {
    e.preventDefault();

    const data = {
      amount: type === "debit" ? -amount : amount,
      description,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={submitFormHandler}>
      <Label className="mb-1">Amount</Label>
      <Input
        type="number"
        className="mb-3"
        required
        value={amount}
        onChange={(e) => setAmount(+e.target.value)}
      />
      <Label className="mb-1">Description</Label>
      <Input
        className="mb-3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="mb-3 flex gap-3 items-center">
        <Label>Credit</Label>
        <Switch
          checked={type === "credit"}
          onCheckedChange={(checked) => setType(checked ? "credit" : "debit")}
        />
      </div>
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};

export default TransactionForm;
