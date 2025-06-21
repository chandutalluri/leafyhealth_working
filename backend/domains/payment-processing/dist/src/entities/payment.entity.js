"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProcessingSchema = exports.webhooks = exports.refunds = exports.transactions = exports.payments = exports.paymentMethods = exports.gatewayCredentials = void 0;
var schema_1 = require("../../drizzle/schema");
Object.defineProperty(exports, "gatewayCredentials", { enumerable: true, get: function () { return schema_1.payment_processing_gateway_credentials; } });
Object.defineProperty(exports, "paymentMethods", { enumerable: true, get: function () { return schema_1.payment_processing_methods; } });
Object.defineProperty(exports, "payments", { enumerable: true, get: function () { return schema_1.payment_processing_payments; } });
Object.defineProperty(exports, "transactions", { enumerable: true, get: function () { return schema_1.payment_processing_transactions; } });
Object.defineProperty(exports, "refunds", { enumerable: true, get: function () { return schema_1.payment_processing_refunds; } });
Object.defineProperty(exports, "webhooks", { enumerable: true, get: function () { return schema_1.payment_processing_webhooks; } });
Object.defineProperty(exports, "PaymentProcessingSchema", { enumerable: true, get: function () { return schema_1.PaymentProcessingSchema; } });
//# sourceMappingURL=payment.entity.js.map