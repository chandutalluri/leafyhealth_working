"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../database");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt = require("bcryptjs");
let UserService = class UserService {
    async findAll() {
        const allUsers = await database_1.db.select({
            id: database_1.users.id,
            email: database_1.users.email,
            name: database_1.users.name,
            role: database_1.users.role,
            department: database_1.users.department,
            phone: database_1.users.phone,
            isActive: database_1.users.isActive,
            emailVerified: database_1.users.emailVerified,
            createdAt: database_1.users.createdAt,
            updatedAt: database_1.users.updatedAt,
            lastLogin: database_1.users.lastLogin
        }).from(database_1.users);
        return allUsers;
    }
    async findOne(id) {
        const [user] = await database_1.db.select({
            id: database_1.users.id,
            email: database_1.users.email,
            name: database_1.users.name,
            role: database_1.users.role,
            department: database_1.users.department,
            phone: database_1.users.phone,
            isActive: database_1.users.isActive,
            emailVerified: database_1.users.emailVerified,
            createdAt: database_1.users.createdAt,
            updatedAt: database_1.users.updatedAt,
            lastLogin: database_1.users.lastLogin
        }).from(database_1.users).where((0, drizzle_orm_1.eq)(database_1.users.id, id));
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async create(createUserDto) {
        const [existingUser] = await database_1.db.select().from(database_1.users).where((0, drizzle_orm_1.eq)(database_1.users.email, createUserDto.email));
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const [newUser] = await database_1.db.insert(database_1.users).values({
            email: createUserDto.email,
            password: hashedPassword,
            name: createUserDto.name,
            role: createUserDto.role || 'user',
            department: createUserDto.department,
            phone: createUserDto.phone,
            isActive: true,
            emailVerified: false
        }).returning();
        await database_1.db.insert(database_1.auditLogs).values({
            userId: newUser.id,
            action: 'user_created',
            resource: 'users',
            details: { email: newUser.email, role: newUser.role }
        });
        return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            department: newUser.department,
            phone: newUser.phone,
            isActive: newUser.isActive,
            tempPassword
        };
    }
    async update(id, updateUserDto) {
        const [existingUser] = await database_1.db.select().from(database_1.users).where((0, drizzle_orm_1.eq)(database_1.users.id, id));
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const [updatedUser] = await database_1.db.update(database_1.users)
            .set({
            ...updateUserDto,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(database_1.users.id, id))
            .returning();
        await database_1.db.insert(database_1.auditLogs).values({
            userId: id,
            action: 'user_updated',
            resource: 'users',
            details: updateUserDto
        });
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            department: updatedUser.department,
            phone: updatedUser.phone,
            isActive: updatedUser.isActive
        };
    }
    async remove(id) {
        const [existingUser] = await database_1.db.select().from(database_1.users).where((0, drizzle_orm_1.eq)(database_1.users.id, id));
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        await database_1.db.delete(database_1.users).where((0, drizzle_orm_1.eq)(database_1.users.id, id));
        await database_1.db.insert(database_1.auditLogs).values({
            userId: id,
            action: 'user_deleted',
            resource: 'users',
            details: { email: existingUser.email }
        });
        return { deleted: true };
    }
    async assignRole(id, role) {
        const [existingUser] = await database_1.db.select().from(database_1.users).where((0, drizzle_orm_1.eq)(database_1.users.id, id));
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const [updatedUser] = await database_1.db.update(database_1.users)
            .set({
            role: role,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(database_1.users.id, id))
            .returning();
        await database_1.db.insert(database_1.auditLogs).values({
            userId: id,
            action: 'role_assigned',
            resource: 'users',
            details: { newRole: role, previousRole: existingUser.role }
        });
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            isActive: updatedUser.isActive
        };
    }
    async getUserPermissions(id) {
        const [user] = await database_1.db.select().from(database_1.users).where((0, drizzle_orm_1.eq)(database_1.users.id, id));
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const userPermissions = this.getDefaultPermissions(user.role);
        return {
            userId: id,
            role: user.role,
            permissions: userPermissions,
            effectivePermissions: this.getEffectivePermissions(user.role, userPermissions)
        };
    }
    getDefaultPermissions(role) {
        const rolePermissions = {
            'SUPER_ADMIN': ['*'],
            'ADMIN': ['user.read', 'user.write', 'business.manage', 'reports.view'],
            'MANAGER': ['team.manage', 'orders.view', 'inventory.view', 'customers.view'],
            'STAFF': ['orders.create', 'inventory.update', 'customers.assist'],
            'CUSTOMER': ['profile.read', 'profile.write', 'orders.create'],
            'DELIVERY_PARTNER': ['delivery.manage', 'orders.view', 'routes.view']
        };
        return rolePermissions[role] || ['profile.read'];
    }
    getEffectivePermissions(role, permissions) {
        if (permissions.includes('*')) {
            return ['All permissions granted'];
        }
        return permissions;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map