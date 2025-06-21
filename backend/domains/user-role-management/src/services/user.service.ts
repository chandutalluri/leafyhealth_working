import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { db, users, roles, userRoles, auditLogs } from '../database';
import { eq, and } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  async findAll() {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      department: users.department,
      phone: users.phone,
      isActive: users.isActive,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      lastLogin: users.lastLogin
    }).from(users);

    return allUsers;
  }

  async findOne(id: number) {
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      department: users.department,
      phone: users.phone,
      isActive: users.isActive,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      lastLogin: users.lastLogin
    }).from(users).where(eq(users.id, id));
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    // Check if user exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, createUserDto.email));
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const [newUser] = await db.insert(users).values({
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
      role: createUserDto.role || 'user',
      department: createUserDto.department,
      phone: createUserDto.phone,
      isActive: true,
      emailVerified: false
    }).returning();

    // Log the user creation
    await db.insert(auditLogs).values({
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
      tempPassword // Return temp password for first-time setup
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const [existingUser] = await db.select().from(users).where(eq(users.id, id));
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const [updatedUser] = await db.update(users)
      .set({
        ...updateUserDto,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();

    // Log the user update
    await db.insert(auditLogs).values({
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

  async remove(id: number) {
    const [existingUser] = await db.select().from(users).where(eq(users.id, id));
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await db.delete(users).where(eq(users.id, id));

    // Log the user deletion
    await db.insert(auditLogs).values({
      userId: id,
      action: 'user_deleted',
      resource: 'users',
      details: { email: existingUser.email }
    });

    return { deleted: true };
  }

  async assignRole(id: number, role: string) {
    const [existingUser] = await db.select().from(users).where(eq(users.id, id));
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const [updatedUser] = await db.update(users)
      .set({ 
        role: role,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();

    // Log the role assignment
    await db.insert(auditLogs).values({
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

  async getUserPermissions(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const userPermissions = this.getDefaultPermissions(user.role);

    return {
      userId: id,
      role: user.role,
      permissions: userPermissions,
      effectivePermissions: this.getEffectivePermissions(user.role, userPermissions)
    };
  }

  private getDefaultPermissions(role: string): string[] {
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

  private getEffectivePermissions(role: string, permissions: string[]): string[] {
    if (permissions.includes('*')) {
      return ['All permissions granted'];
    }
    
    return permissions;
  }
}