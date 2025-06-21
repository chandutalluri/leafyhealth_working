"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerAddressService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_1 = require("../database");
const database_2 = require("../database");
let CustomerAddressService = class CustomerAddressService {
    async createAddress(addressData) {
        const [address] = await database_1.db
            .insert(database_2.customerAddresses)
            .values({
            ...addressData,
            createdAt: new Date(),
            updatedAt: new Date()
        })
            .returning();
        return address;
    }
    async findAddressesByCustomerId(customerId) {
        return await database_1.db
            .select()
            .from(database_2.customerAddresses)
            .where((0, drizzle_orm_1.eq)(database_2.customerAddresses.userId, customerId))
            .orderBy((0, drizzle_orm_1.desc)(database_2.customerAddresses.createdAt));
    }
    async findAddressById(id) {
        const [address] = await database_1.db
            .select()
            .from(database_2.customerAddresses)
            .where((0, drizzle_orm_1.eq)(database_2.customerAddresses.id, id));
        return address || null;
    }
    async updateAddress(id, updateData) {
        const [address] = await database_1.db
            .update(database_2.customerAddresses)
            .set({
            ...updateData,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(database_2.customerAddresses.id, id))
            .returning();
        return address || null;
    }
    async deleteAddress(id) {
        const result = await database_1.db
            .delete(database_2.customerAddresses)
            .where((0, drizzle_orm_1.eq)(database_2.customerAddresses.id, id));
        return result.rowCount > 0;
    }
    async setDefaultAddress(customerId, addressId) {
        await database_1.db
            .update(database_2.customerAddresses)
            .set({ isDefault: false })
            .where((0, drizzle_orm_1.eq)(database_2.customerAddresses.userId, customerId));
        await database_1.db
            .update(database_2.customerAddresses)
            .set({ isDefault: true })
            .where((0, drizzle_orm_1.eq)(database_2.customerAddresses.id, addressId));
    }
};
exports.CustomerAddressService = CustomerAddressService;
exports.CustomerAddressService = CustomerAddressService = __decorate([
    (0, common_1.Injectable)()
], CustomerAddressService);
//# sourceMappingURL=customer-address.service.js.map