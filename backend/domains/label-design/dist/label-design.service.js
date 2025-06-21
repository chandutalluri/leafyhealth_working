"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelDesignService = void 0;
const common_1 = require("@nestjs/common");

let LabelDesignService = class LabelDesignService {
    constructor() {
        this.items = [];
        this.nextId = 1;
    }
    
    async findAll() {
        return this.items;
    }
    
    async findOne(id) {
        const item = this.items.find(item => item.id === parseInt(id));
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        return item;
    }
    
    async create(data) {
        const item = {
            id: this.nextId++,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.items.push(item);
        return item;
    }
    
    async update(id, data) {
        const item = await this.findOne(id);
        Object.assign(item, data, { updatedAt: new Date() });
        return item;
    }
    
    async remove(id) {
        const index = this.items.findIndex(item => item.id === parseInt(id));
        if (index === -1) {
            throw new common_1.NotFoundException('Item not found');
        }
        this.items.splice(index, 1);
        return { deleted: true };
    }
};
LabelDesignService = __decorate([
    (0, common_1.Injectable)()
], LabelDesignService);
exports.LabelDesignService = LabelDesignService;