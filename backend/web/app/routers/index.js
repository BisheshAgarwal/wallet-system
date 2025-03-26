"use strict";

const debug = require("debug")("routers");

debug("Loading");

module.exports = [require("./walletRouter")];
