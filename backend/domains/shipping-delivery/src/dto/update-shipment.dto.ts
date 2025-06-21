export class UpdateShipmentDto {
  trackingNumber?: string;
  orderId?: number;
  customerId?: number;
  estimatedDelivery?: string;
  shippingAddress?: string;
  status?: string;
  notes?: string;
}