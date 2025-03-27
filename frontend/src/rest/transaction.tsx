import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export function transact(walletId, data) {
  return axios.post(`${API_URL}/transact/${walletId}`, data);
}

export function getTransactions(walletId, limit = 10, skip = 0) {
  return axios.get(
    `${API_URL}/transactions?walletId=${walletId}&skip=${skip}&limit=${limit}`
  );
}
