import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { pgTable, serial, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { eq, and, desc } from 'drizzle-orm';

const labelTemplates = pgTable('label_templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  templateType: varchar('template_type', { length: 100 }).notNull(),
  content: text('content').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

const generatedLabels = pgTable('generated_labels', {
  id: serial('id').primaryKey(),
  templateId: serial('template_id').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

const printJobs = pgTable('print_jobs', {
  id: serial('id').primaryKey(),
  labelId: serial('label_id').notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow()
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

@Injectable()
export class LabelService {
  async createLabel(createLabelDto: any) {
    const [label] = await db.insert(labelTemplates).values({
      name: createLabelDto.name,
      templateType: createLabelDto.type,
      content: createLabelDto.content,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return label;
  }

  async getLabels(filters: any = {}) {
    if (filters.type) {
      return await db.select().from(labelTemplates)
        .where(eq(labelTemplates.templateType, filters.type));
    }
    
    return await db.select().from(labelTemplates);
  }

  async getLabelById(id: number) {
    const [label] = await db.select().from(labelTemplates)
      .where(eq(labelTemplates.id, id));
    
    return label;
  }

  async generatePreview(id: number) {
    const label = await this.getLabelById(id);
    if (!label) throw new Error('Label not found');
    
    return {
      id: label.id,
      preview: label.content,
      type: label.templateType
    };
  }

  async getLabelStats() {
    const totalLabels = await db.select().from(labelTemplates);
    const totalGenerated = await db.select().from(generatedLabels);
    
    return {
      totalTemplates: totalLabels.length,
      totalGenerated: totalGenerated.length,
      activeTemplates: totalLabels.filter(l => l.isActive).length
    };
  }
}