import { Transact } from "@/types";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export function transact(walletId = "", data: Transact) {
  return axios.post(`${API_URL}/transact/${walletId}`, data);
}

export function getTransactions(walletId: string | null, limit = 10, skip = 0) {
  return axios.get(
    `${API_URL}/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}`
  );
}
