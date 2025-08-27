// Paystack configuration and utility functions
export interface PaystackConfig {
  publicKey: string;
  email: string;
  amount: number;
  currency: string;
  reference: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

export interface PaystackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  trxref: string;
}

export interface PaystackTransaction {
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
}

export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: PaystackTransaction;
}

// Paystack configuration
export const PAYSTACK_CONFIG = {
  publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
  secretKey: process.env.PAYSTACK_SECRET_KEY || "",
  webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || "",
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://api.paystack.co"
      : "https://api.paystack.co",
};

// Validate Paystack configuration
export const validatePaystackConfig = (): boolean => {
  if (!PAYSTACK_CONFIG.publicKey) {
    console.error("Paystack public key is not configured");
    return false;
  }
  if (!PAYSTACK_CONFIG.secretKey) {
    console.error("Paystack secret key is not configured");
    return false;
  }
  return true;
};

// Generate unique reference for transactions
export const generateReference = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `TAD_${timestamp}_${random}`.toUpperCase();
};

// Format amount for Paystack (amount in kobo for NGN)
export const formatAmount = (
  amount: number,
  currency: string = "NGN"
): number => {
  if (currency === "NGN") {
    // Paystack expects amount in kobo (smallest currency unit)
    return Math.round(amount * 100);
  }
  // For other currencies, return as is
  return Math.round(amount);
};

// Parse amount from Paystack response (convert from kobo to Naira)
export const parseAmount = (
  amount: number,
  currency: string = "NGN"
): number => {
  if (currency === "NGN") {
    // Convert from kobo to Naira
    return amount / 100;
  }
  return amount;
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Create Paystack transaction metadata
export const createTransactionMetadata = (orderData: {
  customerName: string;
  customerPhone: string;
  orderItems: string;
  measurements: string;
  deliveryAddress: string;
}): {
  custom_fields: Array<{
    display_name: string;
    variable_name: string;
    value: string;
  }>;
} => {
  return {
    custom_fields: [
      {
        display_name: "Customer Name",
        variable_name: "customer_name",
        value: orderData.customerName,
      },
      {
        display_name: "Customer Phone",
        variable_name: "customer_phone",
        value: orderData.customerPhone,
      },
      {
        display_name: "Order Items",
        variable_name: "order_items",
        value: orderData.orderItems,
      },
      {
        display_name: "Measurements",
        variable_name: "measurements",
        value: orderData.measurements,
      },
      {
        display_name: "Delivery Address",
        variable_name: "delivery_address",
        value: orderData.deliveryAddress,
      },
    ],
  };
};
