import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router";

import SetupWalletForm from "./components/custom/setup-wallet-form";
import { getWallet, setupWallet } from "./rest/wallet";
import TransactionForm from "./components/custom/transaction-form";
import { transact } from "./rest/transaction";
import { ErrorResponse, Message, Transact, Wallet } from "./types";

const walletId = localStorage.getItem("walletId");

function App() {
  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const fetchWalletById = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getWallet(walletId);
      const wallet = res.data.data;
      setWalletData(wallet);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (walletId) {
      fetchWalletById();
    }
  }, [fetchWalletById]);

  const setupWalletHandler = async (data: Wallet) => {
    try {
      const res = await setupWallet(data);
      const wallet = res.data.data;
      setWalletData(wallet);
      localStorage.setItem("walletId", wallet._id);
    } catch (error) {
      console.log(error);
    }
  };

  const transactHandler = async (data: Transact) => {
    try {
      setMessage(null);
      const res = await transact(walletId, data);
      const updatedBalance = res.data.data.balance;
      setWalletData((prev) =>
        prev ? { ...prev, balance: updatedBalance } : prev
      );
      setMessage({
        status: "success",
        text: res.data.message,
      });
      console.log(res);
    } catch (error) {
      const message = (error as ErrorResponse)?.response?.data?.message;
      setMessage({
        status: "error",
        text: message || "Something went wrong!",
      });
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <NavLink
        to={"/transactions"}
        className="text-xs underline block text-blue-500 mb-3 text-right"
      >
        View all wallet transactions
      </NavLink>
      {!walletId && !walletData && (
        <SetupWalletForm onSubmit={setupWalletHandler} />
      )}
      {walletData && (
        <div className="">
          <div className="flex justify-between">
            <p className="text-sm">
              Username: <span>{walletData.name}</span>
            </p>
            <p className="text-sm">
              Balance: <span>${walletData.balance}</span>
            </p>
          </div>
          <div className="mt-6">
            <h2 className="text-xl mb-3">Initiate Transaction</h2>
            {message?.text && (
              <p
                className={`text-xs mb-3 ${
                  message?.status === "error"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {message.text}
              </p>
            )}
            <TransactionForm onSubmit={transactHandler} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
