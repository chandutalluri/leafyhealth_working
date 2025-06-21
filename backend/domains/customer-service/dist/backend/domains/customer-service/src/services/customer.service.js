"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const database_2 = require("../database");
let CustomerService = class CustomerService {
    async createCustomer(customerData) {
        const [customer] = await database_1.db
            .insert(database_2.customers)
            .values({
            ...customerData,
            createdAt: new Date(),
            updatedAt: new Date()
        })
            .returning();
        return customer;
    }
    async findAllCustomers() {
        return await database_1.db
            .select()
            .from(database_2.customers)
            .orderBy((0, drizzle_orm_1.desc)(database_2.customers.createdAt));
    }
    async findCustomerById(id) {
        const [customer] = await database_1.db
            .select()
            .from(database_2.customers)
            .where((0, drizzle_orm_1.eq)(database_2.customers.id, id));
        return customer || null;
    }
    async findCustomerByEmail(email) {
        const [customer] = await database_1.db
            .select()
            .from(database_2.customers)
            .where((0, drizzle_orm_1.eq)(database_2.customers.email, email));
        return customer || null;
    }
    async updateCustomer(id, updateData) {
        const [customer] = await database_1.db
            .update(database_2.customers)
            .set({
            ...updateData,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(database_2.customers.id, id))
            .returning();
        return customer || null;
    }
    async deleteCustomer(id) {
        const result = await database_1.db
            .delete(database_2.customers)
            .where((0, drizzle_orm_1.eq)(database_2.customers.id, id));
        return result.rowCount > 0;
    }
    async getCustomerStats() {
        const totalCustomers = await database_1.db
            .select({ count: 'count(*)' })
            .from(database_2.customers);
        return {
            totalCustomers: totalCustomers[0]?.count || 0,
            timestamp: new Date().toISOString()
        };
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)()
], CustomerService);
//# sourceMappingURL=customer.service.js.map