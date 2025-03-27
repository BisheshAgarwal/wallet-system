"use strict";

const debug = require("debug")("server:transactionController");
const { default: mongoose } = require("mongoose");

const Transaction = require("../models/transaction");
const Wallet = require("../models/wallet");

debug("Loading");

async function transact(req, res, next) {
  const { walletId } = req.params;
  const { amount, description } = req.body;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    if (!walletId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid wallet id" });
    }

    if (!amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await Wallet.findById(walletId).session(session);

    if (!wallet) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Wallet not found" });
    }

    const type = amount > 0 ? "CREDIT" : "DEBIT";

    if (type === "DEBIT" && wallet.balance < Math.abs(amount)) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient funds" });
    }

    wallet.balance = Number((wallet.balance + amount).toFixed(4));
    await wallet.save({ session });

    const transaction = new Transaction({
      walletId,
      amount: Number(Math.abs(amount).toFixed(4)),
      description: description || "",
      type,
      balance: wallet.balance,
    });
    await transaction.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      balance: transaction.balance,
      transactionId: transaction._id,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("Error:", err.message);
    next(err);
  } finally {
    session.endSession();
  }
}

async function find(req, res, next) {
  const { walletId, skip = 0, limit = 100 } = req.query;

  try {
    if (!walletId) {
      return res.status(400).json({ message: "Invalid wallet id" });
    }

    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      return res.status(400).json({ message: "Invalid wallet ID format" });
    }

    if (!Number.isInteger(Number(skip)) || Number(skip) < 0) {
      return res.status(400).json({ message: "Invalid skip value" });
    }

    if (!Number.isInteger(Number(limit)) || Number(limit) < 0) {
      return res.status(400).json({ message: "Invalid limit value" });
    }

    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
      return res.status(400).json({ message: "Wallet not found" });
    }

    const transactions = await Transaction.find({ walletId })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "Transactions fetched",
      data: transactions,
    });
  } catch (error) {
    console.error("Error:", error.message);
    next(error);
  }
}

module.exports = {
  transact,
  find,
};
