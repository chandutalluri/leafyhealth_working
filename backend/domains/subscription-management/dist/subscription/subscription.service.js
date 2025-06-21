"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const schema = require("../schema");
let SubscriptionService = class SubscriptionService {
    constructor(db) {
        this.db = db;
    }
    async createSubscription(createSubscriptionDto) {
        try {
            const subscription = await this.db.insert(schema.subscriptions).values({
                id: crypto.randomUUID(),
                userId: createSubscriptionDto.userId,
                planType: createSubscriptionDto.planType,
                mealType: createSubscriptionDto.mealType,
                duration: createSubscriptionDto.duration,
                startDate: createSubscriptionDto.startDate,
                endDate: this.calculateEndDate(createSubscriptionDto.startDate, createSubscriptionDto.duration).toISOString().split('T')[0],
                deliveryTime: createSubscriptionDto.deliveryTime,
                branchId: createSubscriptionDto.branchId,
                totalPrice: createSubscriptionDto.totalPrice.toString(),
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning();
            if (createSubscriptionDto.items && createSubscriptionDto.items.length > 0) {
                const subscriptionItems = createSubscriptionDto.items.map(item => ({
                    id: crypto.randomUUID(),
                    subscriptionId: subscription[0].id,
                    productId: item.productId,
                    quantity: item.quantity,
                    dayOffset: item.dayOffset || 0,
                    createdAt: new Date(),
                }));
                await this.db.insert(schema.subscriptionItems).values(subscriptionItems);
            }
            return {
                success: true,
                data: subscription[0],
                message: 'Subscription created successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create subscription');
        }
    }
    async getAllSubscriptions(userId, status) {
        try {
            let whereConditions = [];
            if (userId) {
                whereConditions.push((0, drizzle_orm_1.eq)(schema.subscriptions.userId, userId));
            }
            if (status) {
                whereConditions.push((0, drizzle_orm_1.eq)(schema.subscriptions.status, status));
            }
            const subscriptions = whereConditions.length > 0
                ? await this.db
                    .select()
                    .from(schema.subscriptions)
                    .where((0, drizzle_orm_1.and)(...whereConditions))
                : await this.db.select().from(schema.subscriptions);
            return {
                success: true,
                data: subscriptions,
                count: subscriptions.length,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch subscriptions');
        }
    }
    async getActiveSubscriptions(userId) {
        try {
            const activeSubscriptions = await this.db
                .select()
                .from(schema.subscriptions)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.subscriptions.userId, userId), (0, drizzle_orm_1.eq)(schema.subscriptions.status, 'active')));
            return {
                success: true,
                data: activeSubscriptions,
                count: activeSubscriptions.length,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch active subscriptions');
        }
    }
    async getSubscriptionPlans() {
        const plans = [
            {
                id: 'breakfast-daily',
                name: 'Daily Breakfast',
                mealType: 'breakfast',
                duration: 1,
                price: 150,
                description: 'Fresh organic breakfast delivered daily',
                deliveryTime: '7:00-9:00 AM',
                items: ['Organic oats', 'Fresh fruits', 'Milk', 'Honey']
            },
            {
                id: 'lunch-daily',
                name: 'Daily Lunch',
                mealType: 'lunch',
                duration: 1,
                price: 250,
                description: 'Healthy lunch delivered fresh',
                deliveryTime: '12:00-2:00 PM',
                items: ['Rice/Roti', 'Vegetables', 'Dal', 'Salad']
            },
            {
                id: 'dinner-daily',
                name: 'Daily Dinner',
                mealType: 'dinner',
                duration: 1,
                price: 300,
                description: 'Nutritious dinner for your family',
                deliveryTime: '6:00-8:00 PM',
                items: ['Rice/Roti', 'Curry', 'Vegetables', 'Dessert']
            },
            {
                id: 'full-meal-weekly',
                name: 'Weekly Full Meals',
                mealType: 'all',
                duration: 7,
                price: 4500,
                description: 'Complete meal plan for a week',
                deliveryTime: 'Multiple slots',
                discount: '15% off',
                items: ['All meals included', 'Snacks', 'Beverages']
            },
            {
                id: 'full-meal-monthly',
                name: 'Monthly Full Meals',
                mealType: 'all',
                duration: 30,
                price: 18000,
                description: 'Complete monthly meal subscription',
                deliveryTime: 'Multiple slots',
                discount: '25% off',
                items: ['All meals included', 'Snacks', 'Beverages', 'Special meals']
            }
        ];
        return {
            success: true,
            data: plans,
        };
    }
    async getSubscriptionById(id) {
        try {
            const subscription = await this.db
                .select()
                .from(schema.subscriptions)
                .where((0, drizzle_orm_1.eq)(schema.subscriptions.id, id));
            if (!subscription || subscription.length === 0) {
                throw new common_1.NotFoundException('Subscription not found');
            }
            const items = await this.db
                .select()
                .from(schema.subscriptionItems)
                .where((0, drizzle_orm_1.eq)(schema.subscriptionItems.subscriptionId, id));
            return {
                success: true,
                data: {
                    ...subscription[0],
                    items,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to fetch subscription');
        }
    }
    async updateSubscription(id, updateSubscriptionDto) {
        try {
            const updateData = { ...updateSubscriptionDto, updatedAt: new Date() };
            if (updateData.totalPrice) {
                updateData.totalPrice = updateData.totalPrice.toString();
            }
            if (updateData.startDate) {
                updateData.startDate = updateData.startDate;
            }
            if (updateData.endDate) {
                updateData.endDate = updateData.endDate;
            }
            const updatedSubscription = await this.db
                .update(schema.subscriptions)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema.subscriptions.id, id))
                .returning();
            if (!updatedSubscription || updatedSubscription.length === 0) {
                throw new common_1.NotFoundException('Subscription not found');
            }
            return {
                success: true,
                data: updatedSubscription[0],
                message: 'Subscription updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to update subscription');
        }
    }
    async pauseSubscription(id) {
        return this.updateSubscriptionStatus(id, 'paused');
    }
    async resumeSubscription(id) {
        return this.updateSubscriptionStatus(id, 'active');
    }
    async cancelSubscription(id) {
        return this.updateSubscriptionStatus(id, 'cancelled');
    }
    async updateSubscriptionStatus(id, status) {
        try {
            const updatedSubscription = await this.db
                .update(schema.subscriptions)
                .set({
                status,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema.subscriptions.id, id))
                .returning();
            if (!updatedSubscription || updatedSubscription.length === 0) {
                throw new common_1.NotFoundException('Subscription not found');
            }
            return {
                success: true,
                data: updatedSubscription[0],
                message: `Subscription ${status} successfully`,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to ${status} subscription`);
        }
    }
    async getDeliverySchedule(subscriptionId) {
        try {
            const schedule = await this.db
                .select()
                .from(schema.deliverySchedule)
                .where((0, drizzle_orm_1.eq)(schema.deliverySchedule.subscriptionId, subscriptionId));
            return {
                success: true,
                data: schedule,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to fetch delivery schedule');
        }
    }
    async generateDeliverySchedule(subscriptionId) {
        try {
            const subscription = await this.getSubscriptionById(subscriptionId);
            const subscriptionData = subscription.data;
            const scheduleEntries = [];
            const startDate = new Date(subscriptionData.startDate);
            const endDate = new Date(subscriptionData.endDate);
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                scheduleEntries.push({
                    id: crypto.randomUUID(),
                    subscriptionId,
                    deliveryDate: d.toISOString().split('T')[0],
                    deliveryTime: subscriptionData.deliveryTime,
                    status: 'pending',
                    createdAt: new Date(),
                });
            }
            await this.db.insert(schema.deliverySchedule).values(scheduleEntries);
            return {
                success: true,
                data: scheduleEntries,
                message: 'Delivery schedule generated successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to generate delivery schedule');
        }
    }
    calculateEndDate(startDate, duration) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + duration);
        return end;
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [postgres_js_1.PostgresJsDatabase])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map