"use strict";

const debug = require("debug")("server:walletRouter");
const express = require("express");

const router = express.Router();
const walletController = require("../controllers/walletController");

debug("Loading");

router.post("/setup", walletController.setup);

router.get("/wallet/:walletId", walletController.getDetailsById);

module.exports = router;
