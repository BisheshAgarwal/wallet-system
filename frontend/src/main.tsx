import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App.tsx";
import Layout from "./components/custom/layout.tsx";
import Transactions from "./Transactions.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);
