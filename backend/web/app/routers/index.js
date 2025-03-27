"use strict";

const debug = require("debug")("server:routers");

debug("Loading");

module.exports = [require("./walletRouter"), require("./transactionRouter")];
