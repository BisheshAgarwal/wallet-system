import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export function transact(walletId, data) {
  return axios.post(`${API_URL}/transact/${walletId}`, data);
}
