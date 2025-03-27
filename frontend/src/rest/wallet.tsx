import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export function setupWallet(data) {
  return axios.post(`${API_URL}/setup`, data);
}

export function getWallet(id) {
  return axios.get(`${API_URL}/wallet/${id}`);
}
