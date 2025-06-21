"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/leafyhealth_db';
const client = (0, postgres_1.default)(connectionString);
exports.db = (0, postgres_js_1.drizzle)(client);
exports.default = exports.db;
//# sourceMappingURL=connection.js.map