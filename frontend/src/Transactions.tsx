import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { getTransactions } from "./rest/transaction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Transaction } from "./types";

const walletId = localStorage.getItem("walletId");
const LIMIT = 10;

const Transactions = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<Record<number, Transaction[]>>({});
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (!walletId) {
      navigate("/");
    }
  }, [navigate]);

  const fetchTransactions = useCallback(async () => {
    try {
      if (data[page]) return;
      const res = await getTransactions(walletId, LIMIT, LIMIT * page);
      setData((prev) => ({
        ...prev,
        [page]: res.data.data,
      }));
    } catch (error) {
      console.log(error);
    }
  }, [page, data]);

  useEffect(() => {
    if (!walletId) return;

    fetchTransactions();
  }, [fetchTransactions]);

  const nextPageClickHandler = () => {
    setPage((prev) => prev + 1);
  };

  const previousPageClickHandler = () => {
    setPage((prev) => prev - 1);
  };

  const exportToCsvHandler = async () => {
    try {
      const res = await getTransactions(walletId);
      const transactions = res.data.data;
      if (transactions.length === 0) {
        alert("No transactions to download.");
        return;
      }

      const csvRows = [];

      const headers = [
        "ID",
        "Wallet ID",
        "Amount",
        "Balance",
        "Description",
        "Type",
        "Date",
      ];
      csvRows.push(headers.join(","));

      transactions.forEach((txn: Transaction) => {
        const row = [
          txn._id,
          txn.walletId,
          txn.amount,
          txn.balance,
          txn.description || "-",
          txn.type,
          new Date(txn.date).toLocaleString(),
        ];
        csvRows.push(row.join(","));
      });

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions_${new Date().toISOString()}.csv`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSort = (field: string) => {
    const newSortOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newSortOrder);

    const sortedData = [...data[page]].sort((a, b) => {
      if (field === "amount") {
        return newSortOrder === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      if (field === "date") {
        return newSortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

    setData((prev) => ({
      ...prev,
      [page]: sortedData,
    }));
  };

  return (
    <div>
      <NavLink
        to={"/"}
        className="text-xs underline block text-blue-500 mb-3 text-right"
      >
        Go back
      </NavLink>
      <div className="flex justify-between">
        <h2 className="text-xl mb-3">Transactions</h2>
        <Button
          size="sm"
          variant="outline"
          type="button"
          onClick={exportToCsvHandler}
        >
          Export to CSV
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <Button onClick={() => handleSort("amount")}>
          Sort by Amount{" "}
          {sortBy === "amount" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
        </Button>
        <Button onClick={() => handleSort("date")}>
          Sort by Date{" "}
          {sortBy === "date" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data[page] &&
            data[page].map((txn) => (
              <TableRow key={txn._id}>
                <TableCell>${txn.amount}</TableCell>
                <TableCell>${txn.balance}</TableCell>
                <TableCell>{txn.description || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={txn.type === "CREDIT" ? "success" : "destructive"}
                  >
                    {txn.type}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(txn.date).toLocaleString()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex gap-2">
        {page > 0 && (
          <Button size={"sm"} type="button" onClick={previousPageClickHandler}>
            Previous page
          </Button>
        )}
        {data[page]?.length >= LIMIT && (
          <Button size={"sm"} type="button" onClick={nextPageClickHandler}>
            Next page
          </Button>
        )}
      </div>
    </div>
  );
};

export default Transactions;
