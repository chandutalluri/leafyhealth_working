import { Injectable } from '@nestjs/common';
import { CreateBarcodeDto, BarcodeType } from '../dto/create-barcode.dto';

@Injectable()
export class BarcodeService {
  async generateBarcode(createBarcodeDto: CreateBarcodeDto) {
    // Mock implementation for barcode generation
    const barcodeId = Math.floor(Math.random() * 1000) + 1;
    
    return {
      id: barcodeId,
      data: createBarcodeDto.data,
      type: createBarcodeDto.type,
      format: createBarcodeDto.format,
      productId: createBarcodeDto.productId,
      width: createBarcodeDto.width || this.getDefaultWidth(createBarcodeDto.type),
      height: createBarcodeDto.height || this.getDefaultHeight(createBarcodeDto.type),
      displayText: createBarcodeDto.displayText,
      fileUrl: `https://barcodes.leafyhealth.com/${barcodeId}.${createBarcodeDto.format}`,
      createdAt: new Date().toISOString(),
      isValid: this.validateBarcodeData(createBarcodeDto.data, createBarcodeDto.type),
    };
  }

  async getBarcodes(filters: { type?: BarcodeType; productId?: number }) {
    // Mock implementation returning sample barcodes
    const baseBarcodes = [
      {
        id: 1,
        data: '123456789012',
        type: BarcodeType.UPC_A,
        format: 'PNG',
        productId: 101,
        width: 200,
        height: 60,
        displayText: '123456789012',
        fileUrl: 'https://barcodes.leafyhealth.com/1.png',
        createdAt: '2024-01-15T10:00:00Z',
        isValid: true,
      },
      {
        id: 2,
        data: '1234567890123',
        type: BarcodeType.EAN_13,
        format: 'SVG',
        productId: 102,
        width: 180,
        height: 50,
        displayText: '1234567890123',
        fileUrl: 'https://barcodes.leafyhealth.com/2.svg',
        createdAt: '2024-01-16T14:30:00Z',
        isValid: true,
      },
      {
        id: 3,
        data: 'https://leafyhealth.com/product/103',
        type: BarcodeType.QR_CODE,
        format: 'PNG',
        productId: 103,
        width: 100,
        height: 100,
        fileUrl: 'https://barcodes.leafyhealth.com/3.png',
        createdAt: '2024-01-17T09:15:00Z',
        isValid: true,
      },
    ];

    let filteredBarcodes = baseBarcodes;

    if (filters.type) {
      filteredBarcodes = filteredBarcodes.filter(barcode => barcode.type === filters.type);
    }

    if (filters.productId) {
      filteredBarcodes = filteredBarcodes.filter(barcode => barcode.productId === filters.productId);
    }

    return filteredBarcodes;
  }

  async getBarcodeById(id: number) {
    // Mock implementation for specific barcode
    return {
      id,
      data: '1234567890123',
      type: BarcodeType.EAN_13,
      format: 'PNG',
      productId: 101,
      width: 180,
      height: 50,
      displayText: '1234567890123',
      fileUrl: `https://barcodes.leafyhealth.com/${id}.png`,
      createdAt: '2024-01-15T10:00:00Z',
      isValid: true,
      metadata: {
        checkDigit: '3',
        countryCode: '123',
        manufacturerCode: '456789',
        productCode: '01234',
      },
    };
  }

  async downloadBarcode(id: number) {
    // Mock implementation for barcode download
    return {
      barcodeId: id,
      downloadUrl: `https://barcodes.leafyhealth.com/${id}/download`,
      contentType: 'image/png',
      filename: `barcode-${id}.png`,
      size: 15420, // bytes
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    };
  }

  async getBarcodeStats() {
    return {
      totalBarcodes: 89,
      byType: {
        upc_a: 23,
        ean_13: 31,
        code_128: 15,
        qr_code: 12,
        data_matrix: 5,
        pdf417: 3,
      },
      byFormat: {
        png: 52,
        svg: 24,
        pdf: 13,
      },
      recentActivity: {
        generatedToday: 5,
        downloadedToday: 18,
        mostUsedType: 'EAN-13',
      },
      validation: {
        validBarcodes: 87,
        invalidBarcodes: 2,
        validationRate: 97.8,
      },
    };
  }

  private getDefaultWidth(type: BarcodeType): number {
    const widths = {
      [BarcodeType.UPC_A]: 200,
      [BarcodeType.EAN_13]: 180,
      [BarcodeType.CODE_128]: 150,
      [BarcodeType.QR_CODE]: 100,
      [BarcodeType.DATA_MATRIX]: 80,
      [BarcodeType.PDF417]: 120,
    };
    return widths[type] || 150;
  }

  private getDefaultHeight(type: BarcodeType): number {
    const heights = {
      [BarcodeType.UPC_A]: 60,
      [BarcodeType.EAN_13]: 50,
      [BarcodeType.CODE_128]: 40,
      [BarcodeType.QR_CODE]: 100,
      [BarcodeType.DATA_MATRIX]: 80,
      [BarcodeType.PDF417]: 60,
    };
    return heights[type] || 50;
  }

  private validateBarcodeData(data: string, type: BarcodeType): boolean {
    // Basic validation logic
    switch (type) {
      case BarcodeType.UPC_A:
        return /^\d{12}$/.test(data);
      case BarcodeType.EAN_13:
        return /^\d{13}$/.test(data);
      case BarcodeType.CODE_128:
        return data.length > 0 && data.length <= 80;
      case BarcodeType.QR_CODE:
        return data.length > 0 && data.length <= 2953;
      case BarcodeType.DATA_MATRIX:
        return data.length > 0 && data.length <= 2335;
      case BarcodeType.PDF417:
        return data.length > 0 && data.length <= 1850;
      default:
        return true;
    }
  }
}