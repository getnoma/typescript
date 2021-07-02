#!/usr/bin/env node
import path from "path";
import { configCreator } from "./helpers/generator.js";
const directory = process.argv[2];
if (directory === undefined || directory === null) {
    console.warn(`[WARNING]: Project directory argument is not set! noma-tsc will default to ./`);
}
configCreator(path.resolve(directory ?? `.`)).catch((err) => {
    console.error(`[@noma/typescript::configCreator::catch] Ran into an error: `, JSON.stringify(err));
    throw Error(err);
});
//# sourceMappingURL=index.js.map