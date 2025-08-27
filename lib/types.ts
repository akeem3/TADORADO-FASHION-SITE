// Payment and order types for the application

export interface PaymentData {
  reference: string;
  amount: number;
  currency: string;
  email: string;
  customerName: string;
  customerPhone: string;
  orderItems: string;
  measurements: string;
  deliveryAddress: string;
  metadata?: any;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    reference: string;
    authorization_url?: string;
    access_code?: string;
    transaction_id?: string;
  };
  error?: string;
}

export interface PaymentVerification {
  success: boolean;
  message: string;
  data?: {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    status: "success" | "failed" | "abandoned";
    gateway_response: string;
    customer: {
      email: string;
      customer_code: string;
      first_name?: string;
      last_name?: string;
      phone?: string;
    };
    metadata: {
      custom_fields: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
      referrer?: string;
    };
    paid_at?: string;
    created_at: string;
    updated_at: string;
  };
}

export interface OrderWithPayment {
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    address: string;
    postalCode?: string;
    deliverySpeed: "standard" | "express";
  };
  measurements: Array<{
    gender: "male" | "female";
    height: string;
    shoulder: string;
    chest?: string;
    bust?: string;
    waist: string;
    hip: string;
    sleeve: string;
    inseam?: string;
    neck?: string;
    extraNote?: string;
    measurementUnit: "inches" | "cm";
    label?: string;
    outfitType: string;
  }>;
  paymentInfo: {
    method: "paystack";
    status: "pending" | "success" | "failed";
    reference?: string;
    transactionId?: string;
  };
  cartItems: Array<{
    id: number;
    name: string;
    category: string;
    subCategory: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
  shippingCost: number;
  taxAmount: number;
  notes: string;
  paymentReference?: string;
}

export interface EmailNotificationData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderReference: string;
  totalAmount: number;
  orderItems: string;
  measurements: string;
  deliveryAddress: string;
  paymentStatus: string;
  estimatedDelivery?: string;
  errorMessage?: string;
}

// Google Sheets payment status types
export interface GoogleSheetsPaymentStatus {
  orderReference: string;
  paymentStatus: "pending" | "success" | "failed";
  paymentMethod: "paystack";
  transactionId?: string;
  paymentDate?: string;
  amount: number;
  currency: string;
}
