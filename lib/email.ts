import nodemailer from "nodemailer";

// Email configuration interface
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Email content interface
export interface EmailContent {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Customer email templates
export const createCustomerPaymentSuccessEmail = (orderData: {
  customerName: string;
  orderReference: string;
  totalAmount: number;
  orderItems: string;
  estimatedDelivery: string;
}): EmailContent => ({
  to: orderData.customerName,
  subject: `Payment Confirmed - Order #${orderData.orderReference}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #46332E; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .success-icon { font-size: 48px; color: #28a745; margin-bottom: 20px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .amount { font-size: 24px; font-weight: bold; color: #46332E; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Payment Confirmed!</h1>
          <p>Your order has been successfully placed</p>
        </div>
        
        <div class="content">
          <div style="text-align: center; margin-bottom: 30px;">
            <div class="success-icon">✅</div>
            <h2>Thank you for your order!</h2>
            <p>Dear ${orderData.customerName},</p>
            <p>We're excited to confirm that your payment has been processed successfully and your order is now being prepared.</p>
          </div>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order Reference:</strong> #${
              orderData.orderReference
            }</p>
            <p><strong>Total Amount:</strong> <span class="amount">₦${orderData.totalAmount.toFixed(
              2
            )}</span></p>
            <p><strong>Items:</strong> ${orderData.orderItems}</p>
            <p><strong>Estimated Delivery:</strong> ${
              orderData.estimatedDelivery
            }</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>What happens next?</h4>
            <ul>
              <li>Our team will review your measurements and order details</li>
              <li>Your custom outfit will be crafted with precision</li>
              <li>We'll keep you updated on the progress</li>
              <li>Your order will be shipped to your delivery address</li>
            </ul>
          </div>
          
          <p>If you have any questions about your order, please don't hesitate to contact us.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:info@tadorado.com" style="background: #46332E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">Contact Support</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Tadorado Fashion!</p>
          <p>© 2024 Tadorado Fashion. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
Payment Confirmed - Order #${orderData.orderReference}

Dear ${orderData.customerName},

Thank you for your order! We're excited to confirm that your payment has been processed successfully and your order is now being prepared.

Order Details:
- Order Reference: #${orderData.orderReference}
- Total Amount: ₦${orderData.totalAmount.toFixed(2)}
- Items: ${orderData.orderItems}
- Estimated Delivery: ${orderData.estimatedDelivery}

What happens next?
- Our team will review your measurements and order details
- Your custom outfit will be crafted with precision
- We'll keep you updated on the progress
- Your order will be shipped to your delivery address

If you have any questions about your order, please contact us at info@tadorado.com

Thank you for choosing Tadorado Fashion!
  `,
});

export const createCustomerPaymentFailedEmail = (orderData: {
  customerName: string;
  orderReference: string;
  totalAmount: number;
  orderItems: string;
  errorMessage: string;
}): EmailContent => ({
  to: orderData.customerName,
  subject: `Payment Failed - Order #${orderData.orderReference}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Failed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .error-icon { font-size: 48px; color: #dc3545; margin-bottom: 20px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .amount { font-size: 24px; font-weight: bold; color: #46332E; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Payment Failed</h1>
          <p>We couldn't process your payment</p>
        </div>
        
        <div class="content">
          <div style="text-align: center; margin-bottom: 30px;">
            <div class="error-icon">⚠️</div>
            <h2>Payment Processing Issue</h2>
            <p>Dear ${orderData.customerName},</p>
            <p>We encountered an issue while processing your payment. Your order has not been placed.</p>
          </div>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order Reference:</strong> #${
              orderData.orderReference
            }</p>
            <p><strong>Total Amount:</strong> <span class="amount">₦${orderData.totalAmount.toFixed(
              2
            )}</span></p>
            <p><strong>Items:</strong> ${orderData.orderItems}</p>
            <p><strong>Error:</strong> ${orderData.errorMessage}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>What you can do:</h4>
            <ul>
              <li>Check your payment method and try again</li>
              <li>Ensure you have sufficient funds</li>
              <li>Try a different payment method</li>
              <li>Contact your bank if the issue persists</li>
            </ul>
          </div>
          
          <p>Don't worry, your measurements and order details are saved. You can complete your order anytime.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:info@tadorado.com" style="background: #46332E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">Get Help</a>
          </div>
        </div>
        
        <div class="footer">
          <p>We're here to help you complete your order!</p>
          <p>© 2024 Tadorado Fashion. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
Payment Failed - Order #${orderData.orderReference}

Dear ${orderData.customerName},

We encountered an issue while processing your payment. Your order has not been placed.

Order Details:
- Order Reference: #${orderData.orderReference}
- Total Amount: ₦${orderData.totalAmount.toFixed(2)}
- Items: ${orderData.orderItems}
- Error: ${orderData.errorMessage}

What you can do:
- Check your payment method and try again
- Ensure you have sufficient funds
- Try a different payment method
- Contact your bank if the issue persists

Don't worry, your measurements and order details are saved. You can complete your order anytime.

For assistance, contact us at info@tadorado.com

We're here to help you complete your order!
  `,
});

// Admin email template
export const createAdminOrderNotificationEmail = (orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderReference: string;
  totalAmount: number;
  orderItems: string;
  measurements: string;
  deliveryAddress: string;
  paymentStatus: string;
}): EmailContent => ({
  to: process.env.ADMIN_EMAIL || "admin@tadorado.com",
  subject: `New Order Received - #${orderData.orderReference}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #46332E; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-icon { font-size: 48px; color: #46332E; margin-bottom: 20px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .amount { font-size: 24px; font-weight: bold; color: #46332E; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛍️ New Order Received!</h1>
          <p>Order #${orderData.orderReference}</p>
        </div>
        
        <div class="content">
          <div style="text-align: center; margin-bottom: 30px;">
            <div class="order-icon">📋</div>
            <h2>New Order Details</h2>
            <p>A new order has been placed and payment has been confirmed.</p>
          </div>
          
          <div class="order-details">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${orderData.customerName}</p>
            <p><strong>Email:</strong> ${orderData.customerEmail}</p>
            <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
            
            <h3>Order Information</h3>
            <p><strong>Order Reference:</strong> #${
              orderData.orderReference
            }</p>
            <p><strong>Total Amount:</strong> <span class="amount">₦${orderData.totalAmount.toFixed(
              2
            )}</span></p>
            <p><strong>Payment Status:</strong> <span style="color: #28a745; font-weight: bold;">${
              orderData.paymentStatus
            }</span></p>
            <p><strong>Items:</strong> ${orderData.orderItems}</p>
            
            <h3>Measurements</h3>
            <p>${orderData.measurements}</p>
            
            <h3>Delivery Address</h3>
            <p>${orderData.deliveryAddress}</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>Action Required:</h4>
            <ul>
              <li>Review customer measurements</li>
              <li>Begin crafting the custom outfit</li>
              <li>Update order status in Google Sheets</li>
              <li>Prepare for shipping</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>Order management system - Tadorado Fashion</p>
          <p>© 2024 Tadorado Fashion. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
New Order Received - #${orderData.orderReference}

A new order has been placed and payment has been confirmed.

Customer Information:
- Name: ${orderData.customerName}
- Email: ${orderData.customerEmail}
- Phone: ${orderData.customerPhone}

Order Information:
- Order Reference: #${orderData.orderReference}
- Total Amount: ₦${orderData.totalAmount.toFixed(2)}
- Payment Status: ${orderData.paymentStatus}
- Items: ${orderData.orderItems}

Measurements:
${orderData.measurements}

Delivery Address:
${orderData.deliveryAddress}

Action Required:
- Review customer measurements
- Begin crafting the custom outfit
- Update order status in Google Sheets
- Prepare for shipping

Order management system - Tadorado Fashion
  `,
});

// Create email transporter
export const createTransporter = () => {
  const emailConfig: EmailConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  };

  return nodemailer.createTransport(emailConfig);
};

// Send email function
export const sendEmail = async (
  emailContent: EmailContent
): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_USER || "noreply@tadorado.com",
      to: emailContent.to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Send multiple emails
export const sendMultipleEmails = async (
  emails: EmailContent[]
): Promise<boolean[]> => {
  const results = await Promise.allSettled(
    emails.map((email) => sendEmail(email))
  );

  return results.map((result) =>
    result.status === "fulfilled" ? result.value : false
  );
};
