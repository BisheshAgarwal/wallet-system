export interface Wallet {
  name: string;
  balance: number;
}

export interface Message {
  status: string;
  text: string;
}

export interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface FormData {
  name: string;
  balance: number;
}

export interface SetupWalletFormProps {
  onSubmit: (data: FormData) => void;
}

export interface Transact {
  amount: number;
  description: string;
}

export interface TransactionFormProps {
  onSubmit: (data: Transact) => void;
}

export interface Transaction {
  _id: string;
  walletId: string;
  amount: number;
  balance: number;
  description?: string;
  type: "CREDIT" | "DEBIT";
  date: string;
}
