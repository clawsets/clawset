import "dotenv/config";
import { createProgram } from "./cli.js";

const program = createProgram();

program.parseAsync(process.argv).catch((error: Error) => {
  console.error(`\nFatal error: ${error.message}`);
  process.exit(1);
});
