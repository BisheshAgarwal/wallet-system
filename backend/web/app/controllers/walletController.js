"use strict";

const debug = require("debug")("profileController");
const Wallet = require("../models/wallet");

debug("Loading");

async function setup(req, res, next) {
  try {
    const { balance, name } = req.body;

    if (!balance || !name) {
      return res.status(400).send({ error: "Balance and name are required" });
    }

    const wallet = await Wallet.findOne({ name });

    if (wallet) {
      return res.status(400).send({ error: "Wallet already exists" });
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

    return res.status(201).send(response);
  } catch (err) {
    console.error("Error:", err.message);
    next(err);
  }
}

module.exports = {
  setup,
};
