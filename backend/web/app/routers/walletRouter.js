"use strict";

const debug = require("debug")("profileRouter:info");
const express = require("express");

const router = express.Router();
const walletController = require("../controllers/walletController");

debug("Loading");

router.post("/setup", walletController.setup);

module.exports = router;
