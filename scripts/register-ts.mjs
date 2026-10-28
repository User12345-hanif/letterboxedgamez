/** Registers the extensionless-import resolve hook for `npm run test:daily`. */
import { register } from "node:module";

register("./ts-resolve-hooks.mjs", import.meta.url);
