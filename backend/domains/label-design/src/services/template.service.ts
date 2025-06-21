import { Injectable } from '@nestjs/common';
import { CreateTemplateDto, TemplateCategory } from '../dto/create-template.dto';
import { LabelType } from '../dto/create-label.dto';

@Injectable()
export class TemplateService {
  async createTemplate(createTemplateDto: CreateTemplateDto) {
    // Mock implementation for template creation
    const templateId = Math.floor(Math.random() * 1000) + 1;
    
    return {
      id: templateId,
      name: createTemplateDto.name,
      description: createTemplateDto.description,
      labelType: createTemplateDto.labelType,
      size: createTemplateDto.size,
      category: createTemplateDto.category,
      design: createTemplateDto.design,
      variableFields: createTemplateDto.variableFields,
      isActive: createTemplateDto.isActive !== false,
      previewUrl: createTemplateDto.previewUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
    };
  }

  async getTemplates(filters: { category?: TemplateCategory; labelType?: LabelType }) {
    // Mock implementation returning sample templates
    const baseTemplates = [
      {
        id: 1,
        name: 'Premium Price Tag Template',
        description: 'Elegant price tag with organic styling',
        labelType: LabelType.PRICE_TAG,
        size: '2x1',
        category: TemplateCategory.PREMIUM,
        isActive: true,
        usageCount: 47,
        previewUrl: '/previews/template-1.png',
        createdAt: '2024-01-10T08:00:00Z',
      },
      {
        id: 2,
        name: 'Standard Nutrition Facts',
        description: 'FDA compliant nutrition label template',
        labelType: LabelType.NUTRITION_LABEL,
        size: '4x6',
        category: TemplateCategory.STANDARD,
        isActive: true,
        usageCount: 89,
        previewUrl: '/previews/template-2.png',
        createdAt: '2024-01-12T10:30:00Z',
      },
      {
        id: 3,
        name: 'Organic Certification Label',
        description: 'Template for organic product labeling',
        labelType: LabelType.COMPLIANCE_LABEL,
        size: '4x2',
        category: TemplateCategory.ORGANIC,
        isActive: true,
        usageCount: 23,
        previewUrl: '/previews/template-3.png',
        createdAt: '2024-01-14T14:15:00Z',
      },
      {
        id: 4,
        name: 'Holiday Sale Banner',
        description: 'Seasonal promotional template',
        labelType: LabelType.PROMOTIONAL,
        size: '4x6',
        category: TemplateCategory.SEASONAL,
        isActive: true,
        usageCount: 15,
        previewUrl: '/previews/template-4.png',
        createdAt: '2024-01-16T16:45:00Z',
      },
    ];

    let filteredTemplates = baseTemplates;

    if (filters.category) {
      filteredTemplates = filteredTemplates.filter(template => template.category === filters.category);
    }

    if (filters.labelType) {
      filteredTemplates = filteredTemplates.filter(template => template.labelType === filters.labelType);
    }

    return filteredTemplates;
  }

  async getTemplateById(id: number) {
    // Mock implementation for specific template
    return {
      id,
      name: 'Premium Price Tag Template',
      description: 'Elegant price tag with organic styling and premium fonts',
      labelType: LabelType.PRICE_TAG,
      size: '2x1',
      category: TemplateCategory.PREMIUM,
      design: {
        backgroundColor: '#f8f9fa',
        borderColor: '#28a745',
        fontFamily: 'Roboto',
        fontSize: 14,
        layout: 'centered',
        elements: [
          { type: 'text', field: 'productName', x: 10, y: 10 },
          { type: 'text', field: 'price', x: 10, y: 30, fontSize: 18, fontWeight: 'bold' },
          { type: 'text', field: 'unit', x: 80, y: 35, fontSize: 12 },
        ],
      },
      variableFields: ['productName', 'price', 'unit', 'organic'],
      isActive: true,
      previewUrl: '/previews/template-1.png',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-18T12:30:00Z',
      usageCount: 47,
    };
  }

  async generatePreview(id: number) {
    // Mock implementation for template preview
    return {
      templateId: id,
      previewUrl: `https://preview.leafyhealth.com/templates/${id}/preview.png`,
      sampleData: {
        productName: 'Sample Product',
        price: '$4.99',
        unit: '/lb',
        organic: true,
      },
      dimensions: { width: 200, height: 100 },
      generatedAt: new Date().toISOString(),
    };
  }

  async getTemplateStats() {
    return {
      totalTemplates: 23,
      activeTemplates: 19,
      inactiveTemplates: 4,
      byCategory: {
        standard: 8,
        premium: 6,
        organic: 4,
        sale: 3,
        seasonal: 2,
      },
      byLabelType: {
        priceTag: 7,
        nutritionLabel: 5,
        productLabel: 6,
        complianceLabel: 3,
        promotional: 2,
      },
      usage: {
        mostUsed: 'Standard Nutrition Facts',
        totalUsage: 245,
        averageUsage: 10.7,
      },
    };
  }
}