"use strict";

const debug = require("debug")("server:transactionRouter");
const express = require("express");

const router = express.Router();
const transactionController = require("../controllers/transactionController");

debug("Loading");

router.post("/transact/:walletId", transactionController.transact);
router.get("/transactions", transactionController.find);

module.exports = router;
