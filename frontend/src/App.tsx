import { useCallback, useEffect, useState } from "react";

import SetupWalletForm from "./components/custom/setup-wallet-form";
import { getWallet, setupWallet } from "./rest/wallet";
import TransactionForm from "./components/custom/transaction-form";
import { transact } from "./rest/transaction";

const walletId = localStorage.getItem("walletId");

function App() {
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const setupWalletHandler = async (data) => {
    try {
      const res = await setupWallet(data);
      const wallet = res.data.data;
      setWalletData(wallet);
      localStorage.setItem("walletId", wallet._id);
    } catch (error) {
      console.log(error);
    }
  };

  const transactHandler = async (data) => {
    try {
      const res = await transact(walletId, data);
      const updatedBalance = res.data.data.balance;
      setWalletData((prev) => ({
        ...prev,
        balance: updatedBalance,
      }));
      console.log(res);
    } catch (error) {
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
    <div className="flex flex-col items-center min-h-svh pt-20 px-5">
      <div className="max-w-[700px] w-full">
        <h1 className="text-3xl mb-3">Wallet System</h1>

        <hr className="mb-5" />

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
              <TransactionForm onSubmit={transactHandler} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
