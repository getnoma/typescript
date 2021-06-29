#!/usr/bin/env node

import path from "path";
import { configCreator } from "./helpers/generator.js";

const directory = process.argv[2];

if (directory === undefined || directory === null) {
	console.error(`[ERR]: You must provide a project directory argument.`);
	process.exit(1);
}

configCreator(path.resolve(directory)).catch((err) => {
	console.error(`[@noma/typescript::configCreator::catch] Ran into an error: `, JSON.stringify(err));
	throw Error(err);
});
