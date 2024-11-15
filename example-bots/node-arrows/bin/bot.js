#!/usr/bin/env node
import process from "node:process";
require = require("esm")(module /*, options*/);
require("../src/cli.js").cli(process.argv);
