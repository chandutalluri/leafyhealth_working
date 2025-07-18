"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConnection = exports.db = void 0;
var connection_1 = require("../../../../shared/database/connection");
Object.defineProperty(exports, "db", { enumerable: true, get: function () { return connection_1.db; } });
Object.defineProperty(exports, "databaseConnection", { enumerable: true, get: function () { return connection_1.databaseConnection; } });
__exportStar(require("../../../../shared/schema"), exports);
console.log('🔗 Database connected to PostgreSQL');
//# sourceMappingURL=database.js.map