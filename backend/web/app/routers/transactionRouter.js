"use strict";

const debug = require("debug")("transactionRouter:info");
const express = require("express");

const router = express.Router();
const transactionController = require("../controllers/transactionController");

debug("Loading");

router.post("/transact/:walletId", transactionController.transact);

module.exports = router;
