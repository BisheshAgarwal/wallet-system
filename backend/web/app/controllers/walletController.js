"use strict";

const debug = require("debug")("walletController");
const Wallet = require("../models/wallet");

debug("Loading");

async function setup(req, res, next) {
  try {
    const { balance, name } = req.body;

    if (!balance || !name) {
      return res.status(400).json({ message: "Balance and name are required" });
    }

    const wallet = await Wallet.findOne({ name });

    if (wallet) {
      return res.status(400).json({ message: "Wallet already exists" });
    }

    const newWallet = new Wallet({
      balance: balance.toFixed(4),
      name,
      date: new Date(),
    });
    const insertedWallet = await newWallet.save();

    const response = {
      _id: insertedWallet._id,
      name: insertedWallet.name,
      balance: insertedWallet.balance,
      date: insertedWallet.date,
    };

    return res.status(201).json({ message: "Wallet created", data: response });
  } catch (err) {
    console.error("Error:", err.message);
    next(err);
  }
}

async function getDetailsById(req, res, next) {
  try {
    const { walletId } = req.params;

    if (!walletId) {
      return res.status(400).json({ message: "Invalid wallet id" });
    }

    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    return res.status(200).json({
      _id: wallet._id,
      balance: wallet.balance,
      name: wallet.name,
      date: wallet.date,
    });
  } catch (error) {
    console.error("Error:", err.message);
    next(err);
  }
}

module.exports = {
  setup,
  getDetailsById,
};
