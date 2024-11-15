import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Prisma, PrismaClient, PrismaPromise } = require("@prisma/client");
export { Prisma, PrismaClient, PrismaPromise };
