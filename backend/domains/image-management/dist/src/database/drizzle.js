"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.images = exports.db = void 0;
const neon_http_1 = require("drizzle-orm/neon-http");
const serverless_1 = require("@neondatabase/serverless");
const schema = require("./image.schema");
const sql = (0, serverless_1.neon)(process.env.DATABASE_URL);
exports.db = (0, neon_http_1.drizzle)(sql, { schema });
var image_schema_1 = require("./image.schema");
Object.defineProperty(exports, "images", { enumerable: true, get: function () { return image_schema_1.images; } });
//# sourceMappingURL=drizzle.js.map