"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedAuthModule = exports.ROLES_KEY = exports.Roles = exports.RolesGuard = exports.JwtAuthGuard = void 0;
var jwt_auth_guard_1 = require("./jwt-auth.guard");
Object.defineProperty(exports, "JwtAuthGuard", { enumerable: true, get: function () { return jwt_auth_guard_1.JwtAuthGuard; } });
var roles_guard_1 = require("./roles.guard");
Object.defineProperty(exports, "RolesGuard", { enumerable: true, get: function () { return roles_guard_1.RolesGuard; } });
var roles_decorator_1 = require("./roles.decorator");
Object.defineProperty(exports, "Roles", { enumerable: true, get: function () { return roles_decorator_1.Roles; } });
Object.defineProperty(exports, "ROLES_KEY", { enumerable: true, get: function () { return roles_decorator_1.ROLES_KEY; } });
var auth_module_1 = require("./auth.module");
Object.defineProperty(exports, "SharedAuthModule", { enumerable: true, get: function () { return auth_module_1.SharedAuthModule; } });
//# sourceMappingURL=index.js.map