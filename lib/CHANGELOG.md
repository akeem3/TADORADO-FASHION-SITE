# Changelog

## [Unreleased] - Paystack Payment Integration & Email System Implementation

### Completed Implementation

**Phase 1: Dependencies & Configuration (Steps 1-3) ✅**

**Step 1: Dependencies Installed ✅**

- Paystack SDK and Nodemailer packages installed
- TypeScript types for Nodemailer added

**Step 2: Environment Setup ✅**

- Environment variables configured for Paystack integration
- Email SMTP configuration structure created
- Admin email notification setup ready

**Step 3: Paystack Configuration ✅**

- Created `lib/paystack.ts` with:
  - Paystack configuration and validation functions
  - Transaction interfaces and types (PaystackConfig, PaystackTransaction, PaystackResponse)
  - Utility functions for amount formatting, reference generation
  - Transaction metadata creation with proper TypeScript types
  - Email validation and currency handling
- Created `lib/email.ts` with:
  - Nodemailer configuration and transporter setup
  - Professional email templates for customer payment success/failure
  - Admin order notification email template
  - Email sending utilities with error handling
- Created `lib/types.ts` with:
  - Payment and order interfaces (PaymentData, PaymentResponse, PaymentVerification)
  - Email notification data types
  - Google Sheets payment status types
  - OrderWithPayment interface for complete order flow

**Technical Implementation Details:**

- **TypeScript Compliance**: Fixed all linting errors, replaced `any` types with proper interfaces
- **Environment Variables**: Updated to use `PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY` format
- **Email Templates**: Beautiful, responsive HTML email templates with brand styling
- **Error Handling**: Comprehensive error handling for payment and email operations
- **Type Safety**: Full TypeScript support with proper interfaces and type checking

**Files Created/Modified:**

- ✅ `lib/paystack.ts` - Paystack configuration and utilities
- ✅ `lib/email.ts` - Email system with templates
- ✅ `lib/types.ts` - TypeScript interfaces
- ✅ `env.example` - Environment variable structure (updated)

### Next Steps (Phase 2: Backend API Routes) ✅

**Step 4: Payment Initialization API Route ✅**

- Created `/api/paystack/initialize` endpoint
- Handles payment start and Paystack integration
- Generates unique transaction references
- Creates transaction metadata with order details
- Returns Paystack authorization URL for frontend

**Step 5: Payment Verification API Route ✅**

- Created `/api/paystack/verify` endpoint
- Verifies payment completion with Paystack
- Confirms transaction status and details
- Parses amount from kobo to Naira
- Returns verified payment data

**Step 6: Email Service Integration ✅**

- Created `/api/paystack/process-order` endpoint
- Sends admin email notifications for successful orders
- Integrates with existing Google Sheets export system
- Processes complete order flow after payment verification
- Handles both email and Google Sheets operations

**Technical Fixes Applied:**

- ✅ Fixed TypeScript error in payment verification route
- ✅ Removed unused type imports for better type safety
- ✅ All API routes now compile without TypeScript errors

**API Routes Created:**

- ✅ `/api/paystack/initialize` - Start payment process
- ✅ `/api/paystack/verify` - Verify payment completion
- ✅ `/api/paystack/process-order` - Process successful orders & send admin emails

**Environment Variables Required:**
Please add the following to your `.env` file:

```
PAYSTACK_SECRET_KEY=your_secret_key_here
PAYSTACK_PUBLIC_KEY=your_public_key_here
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
ADMIN_EMAIL=your_gmail@gmail.com
```

**Environment Setup Status: ✅ COMPLETED**

- All required environment variables have been configured
- Paystack API keys are set up for test mode
- Gmail SMTP configuration is ready for admin notifications
- Admin email notifications will be sent to the configured email address

### Phase 3: Frontend Integration ✅ COMPLETED

**Step 7: Checkout Payment Step Update ✅**

- Replaced dummy payment methods with Paystack integration
- Added payment processing state management
- Integrated order data collection and storage

**Step 8: Paystack Payment Button & UI ✅**

- Created modern Paystack payment button with loading states
- Added payment error handling and display
- Updated payment section with secure gateway messaging
- Removed unused radio button payment methods

**Step 9: Payment Success/Failure Handling ✅**

- Created comprehensive success page with payment verification
- Added automatic order processing after payment success
- Integrated with admin email notifications and Google Sheets
- Added session storage for order data persistence
- Implemented payment verification flow with Paystack API

**Frontend Files Modified:**

- ✅ `app/checkOut/page.tsx` - Updated PaymentStep component with Paystack integration
- ✅ `app/checkOut/success/page.tsx` - Created new success page with payment verification
- ✅ Added payment processing states and error handling
- ✅ Integrated order data storage and retrieval

## [Unreleased] - Product Page Mobile Responsiveness Fix

### Fixed

- **Mobile Layout Overflow**: Fixed issue where increment/decrement buttons, Add to Cart button, and Buy Now button were overflowing beyond the screen edge on mobile devices
- **Responsive Layout**: Implemented responsive layout that stacks vertically on mobile and maintains horizontal layout on larger screens
- **Touch Targets**: Improved touch targets for quantity controls with fixed width/height (w-12 h-12)
- **Button Sizing**: Made action buttons full-width on mobile for better usability

### Technical Details

- **Layout Structure**: Changed from single horizontal row to responsive flex layout (`flex flex-col sm:flex-row`)
- **Quantity Controls**: Wrapped in centered container with proper spacing and touch targets
- **Action Buttons**: Stacked vertically on mobile with full-width, side-by-side on larger screens
- **Files Modified**: `app/collections/product/[id]/page.tsx` - Product page mobile responsiveness

### User Experience Improvements

- **Mobile Users**: No more horizontal scrolling or buttons cut off screen edges
- **Touch Interaction**: Larger, more accessible touch targets for quantity controls
- **Visual Consistency**: Maintains design consistency across all screen sizes
- **Accessibility**: Better usability on mobile devices with proper button sizing

## [Unreleased] - Direct Buy Data Storage Issue Investigation

### Issue Identified: Direct Buy Product Data Not Stored in Google Sheets

**Problem:** When using "Buy Now" functionality, product category, sub-category, and image data are not being stored in the Google Sheet, unlike cart checkouts which work correctly.

**Root Cause Analysis:**

- **Checkout Flow Issue:** In `app/checkOut/page.tsx`, the `onSubmit` function always sends `cartItems` to the API, even in "buy now" mode
- **Data Source Problem:** When in "buy now" mode, `cartItems` is empty, so no product data gets processed by the API
- **API Processing:** The `/api/orders/route.ts` correctly processes `cartItems` for category, sub-category, and image data, but receives empty array for direct buys

**Technical Details:**

- **Buy Now Flow:** Product data is stored in `buyNowItem` state and `sessionStorage`
- **API Call:** Always sends `cartItems` instead of checking for `buyNowMode` and sending `buyNowItem`
- **Data Mapping:** API maps `cartItems.map((item) => item.category)` etc., but `cartItems` is empty for direct buys

**Files Affected:**

- `app/checkOut/page.tsx` - `onSubmit` function needs to handle buy now mode
- `app/api/orders/route.ts` - May need to handle both cart and buy now data formats

**Expected Behavior:**

- Cart checkouts: ✅ Product data stored correctly
- Direct buy single product: ❌ Product data missing
- Direct buy multiple quantities: ❌ Product data missing

**Solution Implemented:**

- **Modified `onSubmit` function in `app/checkOut/page.tsx`:**
  - Added conditional logic to send `buyNowItem` when in "buy now" mode
  - Added conditional logic to send correct `totalAmount` based on mode
  - Added conditional cart clearing (only clear cart if not in buy now mode)
- **Technical Changes:**

  ```typescript
  // Determine which items to send based on buy now mode
  const itemsToSend = buyNowMode && buyNowItem ? [buyNowItem] : cartItems;
  const totalAmountToSend = buyNowMode ? buyNowTotal : cartTotal;

  // Send correct data to API
  cartItems: itemsToSend,
  totalAmount: totalAmountToSend,

  // Clear cart only if not in buy now mode
  if (!buyNowMode) {
    setTimeout(() => clearCart(), 500);
  }
  ```

**Result:**

- Cart checkouts: ✅ Product data stored correctly
- Direct buy single product: ✅ Product data now stored correctly
- Direct buy multiple quantities: ✅ Product data now stored correctly

## [Unreleased] - Remaining Critical Issues

### High Priority Issues

- [ ] **Payment Integration** - Essential for functional e-commerce (Paystack/Flutterwave for Nigeria & international payments)
- [ ] **Node Mailer** - Email notifications to admin when orders are placed
- [ ] **Render Cold Start Downtime** - Need to implement a pinger to keep the app warm

### Completed Issues

- [x] **Checkout Measurement Step** - Style dropdown now dynamically populates from database (like collection page does)
- [x] **Direct Buy Data Storage Issue** - Product category, sub-category, and image data now correctly stored in Google Sheets for direct purchases

### Previous Issues

## [Unreleased] - Multiple Measurement System Fix

### Multiple Measurement System Issues Fixed

- **Add Another Person Button:** Fixed issue where adding a new measurement would not switch to the new measurement form
- **Active Measurement Index:** Corrected the logic to properly set the active measurement index to the newly added measurement
- **Form Navigation:** Ensured clicking on measurement tabs correctly switches between different measurement forms without advancing the checkout step
- **State Management:** Improved the state update logic to use the new measurements array length instead of the old one

### Technical Details

- **Root Cause:** `setActiveMeasurementIndex(measurements.length)` was using the old array length before the new measurement was added
- **Solution:** Moved the `setActiveMeasurementIndex` call inside the `setMeasurements` callback to ensure it uses the updated array
- **Code Change:**

  ```typescript
  // Before (incorrect)
  setMeasurements((prev) => [...prev, newMeasurement]);
  setActiveMeasurementIndex(measurements.length);

  // After (correct)
  setMeasurements((prev) => {
    const newMeasurements = [...prev, newMeasurement];
    setActiveMeasurementIndex(newMeasurements.length - 1);
    return newMeasurements;
  });
  ```

### User Experience Improvements

- **Fresh Forms:** New measurements now show empty forms instead of displaying previous measurement data
- **Proper Navigation:** Users can now click between measurement tabs to edit different people's measurements
- **Intuitive Flow:** The form stays on the measurement step when adding/removing people as expected

## [Unreleased] - Render Deployment Migration

### Migration from Vercel to Render

- **Reason for Migration:** Vercel deployment failures due to strict limitations with Prisma, Node.js APIs, and Aiven database integration
- **Target Platform:** Render.com for better compatibility with full-stack applications
- **Benefits:** Longer build times, better Node.js compatibility, simpler deployment

### Deployment Infrastructure Setup

- **Database:** **Keep existing Aiven MySQL database** (no changes needed)
- **Web Service:** Node.js application with Prisma ORM on Render
- **Environment:** Production-optimized configuration
- **CI/CD:** Automatic deployment from GitHub repository

### Configuration Files Created

- `render.yaml` - Render service configuration (web service only)
- `env.example` - Environment variables template
- `scripts/build.js` - Production build script
- `scripts/deploy.js` - Deployment automation script
- `DEPLOYMENT.md` - Comprehensive deployment guide

### Production Optimizations

- **Next.js Config:** Added standalone output and production optimizations
- **Package.json:** Added postinstall script for Prisma generation
- **Build Process:** Optimized for Render's build environment
- **Environment Variables:** Structured for production deployment

### Deployment Steps Required

1. **Manual Steps (User):**

   - Create Render account (no database setup needed)
   - Copy existing Aiven database URL to Render environment variables
   - Copy existing Google Sheets configuration
   - Connect GitHub repository
   - Set up custom domain (optional)

2. **Automated Steps (System):**
   - Automatic build and deployment from GitHub
   - Prisma client generation and database connection
   - Health checks and monitoring

### Environment Variables Required

- `DATABASE_URL` - **Existing Aiven MySQL connection string**
- `GOOGLE_SERVICE_ACCOUNT` - **Existing Google service account JSON**
- `GOOGLE_SHEET_ID` - **Existing Google Sheet ID**
- `GOOGLE_SHEET_FILENAME` - **Existing sheet name (Tadorado)**
- `NODE_ENV` - Production environment
- `NODE_OPTIONS` - OpenSSL legacy provider for compatibility

### Key Benefits of This Approach

- **No Database Migration:** Keep your existing Aiven setup
- **No Data Loss:** All existing data remains intact
- **Simpler Setup:** Only frontend and API deployment
- **Cost Effective:** No additional database costs
- **Faster Deployment:** Less configuration required

### Build Issues Fixed

- **Next.js Configuration:** Removed invalid `outputFileTracingRoot` from experimental config
- **Seed Script:** Added missing `slug` field to all products and implemented `slugify` function
- **Browserslist:** Updated to latest version to resolve deprecation warnings
- **Build Process:** Now builds successfully with all TypeScript checks passing

### Render Deployment Fixes

- **Simplified Approach:** Removed custom server.js and used standard Next.js start command
- **Port Configuration:** Set explicit port `-p 10000` in start script for Render compatibility
- **Environment Variables:** Ensured `NODE_ENV=production` is set correctly
- **Next.js Config:** Added Prisma client to external packages for proper bundling
- **Build Process:** Standardized on `npm start` command for Render deployment

### Next Steps

- Complete Render web service deployment
- Test production environment with existing Aiven database
- Configure monitoring and logging
- Set up custom domain and SSL
- Implement payment gateway integration

## [Unreleased] - Full Application Overview

### Core Features

- Modern, filterable product catalog with detailed product pages.
- Persistent shopping cart and multi-step checkout flow.
- Custom measurement collection for tailored orders.
- Google Sheets integration for order export and fulfillment.
- Responsive, branded UI with smooth animations and accessibility improvements.

### Admin & Backend

- Admin dashboard for product management (in progress).
- Prisma ORM with MySQL for robust data storage.
- Firebase Storage for fast, reliable image hosting.
- Comprehensive API routes for products, orders, and admin actions.

### Technical Enhancements

- Strong type safety and error handling throughout.
- Database seed script for easy local development.

### Upcoming

- Payment gateway integration (Paystack, Flutterwave, Monnify).
- Customer login and order history.
- Admin order management and analytics.

## [Unreleased] - Google Sheets Integration (In Progress)

### Environment Setup (Completed)

- Service account created in Google Cloud Console
- Google Sheets API enabled
- Google Sheet shared with service account email as Editor
- Google Sheet credentials, ID, and filename added to `.env`

### Backend Implementation (Completed)

- Created `lib/googleSheets.ts` utility for Google Sheets API authentication and order export
- Integrated Google Sheets export into `app/api/orders/route.ts` POST endpoint
- Orders are now exported to Google Sheets on completion
- Robust error handling, logging, and retry logic implemented
- Type safety improved and all linter errors resolved

### Frontend Integration (Completed)

- Checkout page (`app/checkOut/page.tsx`) submits order data to `/api/orders` on completion
- User is redirected to a success page if the order is exported successfully
- Error feedback is shown to the user if export fails
- Cart is cleared after successful order

### Next Steps

- Test the full order flow and confirm orders appear in Google Sheets
- Monitor logs for export success/failure
- Optionally, enhance frontend error feedback and document the integration

### Troubleshooting

#### Google Sheets Export Fails with OpenSSL/Node.js Error

- **Error:**
  - `Google Sheets export error: Error: error:1E08010C:DECODER routines::unsupported ... reason: 'unsupported', code: 'ERR_OSSL_UNSUPPORTED'`
- **Cause:**
  - This is a Node.js/OpenSSL compatibility issue (common in Node.js 17+ and 22+). OpenSSL 3 disables some legacy algorithms by default, which are needed for Google service account keys.
- **Solution:**
  - Add the following to your `.env` file:
    ```
    NODE_OPTIONS=--openssl-legacy-provider
    ```
  - Or, set it in your terminal before running your app:
    - Windows: `set NODE_OPTIONS=--openssl-legacy-provider`
    - Mac/Linux: `export NODE_OPTIONS=--openssl-legacy-provider`
  - Then restart your dev server and try again.
- **Alternative:**
  - Use Node.js 16.x LTS, which does not have this issue.

### .env Example

```
GOOGLE_SERVICE_ACCOUNT={...single-line JSON...}
GOOGLE_SHEET_ID=1GjYMut5bSUcGcyS7iNZyqlYL4PS34oVVp0XY2XUXktM
GOOGLE_SHEET_FILENAME=Tadorado Export
```

### Added

- Google Drive API integration for automatic order data export
- Excel file creation and management in Google Drive
- Order data export functionality
- Complete Excel utility functions for data manipulation
- Main integration function for order export
- Comprehensive type safety and error handling

### Changed

- All previous Google Drive/Excel export code has been removed from the backend and API. The codebase is now ready for Google Sheets API integration.

### Fixed

- Fixed issue where the frontend did not call the order API, so orders were not exported to Google Drive. The frontend will be updated to POST order data to /api/orders when the Complete Order button is clicked.
- Buy Now button now adds product to cart and redirects to checkout
- Collections page now shows a loading indicator instead of 'no items available' before products load
- Improved user experience for product loading states
- Fixed issue where the cart was cleared before redirecting to the success page, causing a brief 'cart empty' flash. Now, the cart is cleared after navigation to the success page for a seamless experience.

### Improved

- All buttons and form fields in the checkout flow now feature fully rounded edges for a modern, friendly look
- Button and input colors, borders, and backgrounds now match the brown/cream theme of the success page for a consistent brand experience
- Font weights and sizes updated for clarity and friendliness, matching the success page style
- Improved padding and spacing for a softer, more inviting UI
- Checkout forms now feature friendlier copy, clearer instructions, and improved styling for a more user-friendly experience
- Users can now add measurements for multiple people/sizes in a single order, with the ability to add, review, and remove entries before completing checkout
- **MAJOR UI/UX ENHANCEMENT**: Completely redesigned checkout form with modern, intuitive interface
  - Enhanced measurement step with clear person selection tabs and intuitive "Add Another Person" functionality
  - Improved visual hierarchy with gradient headers, better spacing, and consistent styling
  - Added helpful placeholders and better form organization with grouped sections
  - Enhanced delivery step with separate contact and address sections for better clarity
  - Improved payment step with better visual payment method selection and enhanced order summary
  - Added visual indicators and better feedback for user interactions
  - Implemented consistent color scheme and typography throughout all checkout steps
- Inputs, selects, and textareas now use rounded-xl and a light brown border (#E5D3C6) for a slightly curved, elegant look
- Buttons now use rounded-xl for a slightly rounded appearance, matching the sample image
- Removed all rounded-full from form fields and buttons for a more subtle, modern curve
- All select boxes now show a soft light brown border and ring when focused/clicked, matching the theme and improving accessibility and feedback
- All select dropdowns now have a soft cream background color (#FDF7F2) for the options, matching the brand and improving visual clarity

### Technical Details

- Added googleapis and xlsx packages for Google Drive API and Excel operations
- Created service account authentication with JWT
- Implemented Excel file operations (create, append, update, read)
- Added comprehensive error handling and logging for file operations
- Created comprehensive data structure for order export with 23 columns
- Implemented proper type casting and validation for Excel data
- Added column width optimization for better Excel readability

### Files Modified

- `app/api/orders/route.ts` - Enhanced with Google Drive export (pending)
- `lib/googleDrive.ts` - ✅ New utility functions for Google Drive operations
- `lib/excelUtils.ts` - ✅ New utility functions for Excel operations (all linter errors fixed)
- `lib/orderExport.ts` - ✅ Main integration function for order export
- `app/checkOut/page.tsx` - ✅ **MAJOR UI/UX REDESIGN**: Enhanced checkout form with modern styling and improved user experience
- `lib/CHANGELOG.md` - ✅ Updated with progress tracking
- Environment variables for Google Drive credentials

### Environment Variables Required

- `GOOGLE_DRIVE_CREDENTIALS` - The **entire service account JSON** as a single line. All newlines in the private key must be replaced with `\\n` (double backslash + n). Example:

  GOOGLE_DRIVE_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"...@....iam.gserviceaccount.com",...}

- `GOOGLE_DRIVE_FOLDER_ID`

### Fixes

- Fixed Google Sheets export error on Node.js 17+/22+ by transforming the service account private key from literal \n to real newlines at runtime.
- Integration now works natively on Node.js 22+ without needing --openssl-legacy-provider.

### Updates

- Changed all references to the sheet/tab name to 'Tadorado' in the code and environment variables.
- Ensure the Google Sheet tab is named 'Tadorado' to match the integration and avoid range errors.

### Automation

- The integration now automatically checks for the existence of the sheet/tab before appending order data.
- If the tab does not exist, it is created programmatically using the Google Sheets API.
- This makes the export process fully robust and automated—no manual tab creation needed.

### Formatting Improvements

- Each order now always starts at column A, preventing column drift or gaps.
- Address and measurements fields are formatted with newlines for readability (multi-line cells).
- Measurements are presented as readable text, not arrays, and grouped by person.
- All fields are trimmed and formatted for a presentable, easy-to-read sheet for order fulfillment.

### Bug Fixes

- Export now always outputs exactly 23 columns (A–W), filling missing values with empty strings. This prevents column drift and ensures all orders start at column A.
- The append range now anchors at A1 (not A2:W), following Google Sheets API best practices. This prevents column drift and ensures all orders always start at column A.

## Planned Payment Integration (Nigeria & International)

- Support for Naira card payments (Verve, Visa, Mastercard issued in Nigeria)
- Support for international card payments (Visa, Mastercard, etc.)
- Support for bank transfer (manual and automated with virtual accounts)
- Support for fintech wallets (Opay, Moniepoint, PalmPay, etc.)
- Use Paystack and/or Flutterwave for broadest coverage and easiest integration
- Optionally add Monnify for advanced bank transfer automation
- User can select payment method at checkout; backend verifies and records payment status
- All payment flows are secure, PCI DSS compliant, and support both local and international customers
- Best practices: multiple payment options, clear instructions, virtual accounts for transfer, robust error handling, and customer support

## [Unreleased] - Minor Issues Before Payment Integration

### Resolved

- [x] Quantity of product bought check (confirmed: correct quantity is added to Google Sheet)
- [x] Currency to Naira (all $ symbols replaced with ₦ in UI)
- [x] Sale price field removed from Google Sheets export and backend logic
- [x] Sale price concept fully removed from all calculations, UI, models, and data
- [x] Contact Page completion (dedicated contact page with location, Google Maps integration, and updated contact details)
- [x] Contact Details update (location, phone, email, business hours updated and Google Maps loading issue fixed)
- [x] Product page styling (removed review stars, enhanced buttons with rounded-2xl styling)

### Remaining Issues

- [ ] **Payment Integration** - Essential for functional e-commerce (Paystack/Flutterwave for Nigeria & international payments)
- [ ] **Node Mailer** - Email notifications to admin when orders are placed
- [x] **Checkout Measurement Step** - Style dropdown now dynamically populates from database (like collection page does)
- [ ] **Render Cold Start Downtime** - Need to implement a pinger to keep the app warm

## [Unreleased] - Render Deployment Build Fix

### Fixed

- **Build Error Resolution:** Fixed TypeScript compilation error in `scripts/seed.ts` where `salePrice` field was being used but doesn't exist in the Product model schema
- **Seed Script Cleanup:** Removed the `salePrice: 50` field from the "Ankara Shirt & Trousers" product in the seed data to match the current Prisma schema
- **Deployment Compatibility:** This fix resolves the Render deployment build failure that was preventing successful deployment

### Technical Details

- **Error:** `Object literal may only specify known properties, and 'salePrice' does not exist in type 'ProductCreateManyInput'`
- **Root Cause:** The seed script was still referencing the `salePrice` field which was removed from the Product model as part of the sale price concept removal
- **Solution:** Removed the `salePrice` field from the product data in `scripts/seed.ts`
- **Impact:** Build now passes TypeScript compilation and should deploy successfully on Render

## [Unreleased] - Product Page UI Improvements

### Fixed

- **Review Stars Removal:** Removed the hardcoded 5-star review display and "(24 reviews)" text from the product detail page
- **Button Styling Enhancement:** Applied consistent `rounded-2xl` styling to all buttons on the product page
- **Hover Effects:** Added smooth hover transitions with `transition-colors duration-200` for better user experience
- **Button Consistency:** Styled quantity controls (-/+) with subtle gray hover effects
- **Primary Buttons:** Enhanced "Add to Cart" and "Buy Now" buttons with brand color hover effects (`hover:bg-[#46332E]/90`)
- **Component Consistency:** Updated AddToCartButton component to match the rounded-2xl styling and smooth transitions

### Technical Details

- **Files Modified:**
  - `app/collections/product/[id]/page.tsx` - Product page styling
  - `components/ui/AddToCartButton.tsx` - Component button styling consistency
- **Removed:** Star icon import and review stars section
- **Added:** Rounded corners, hover effects, and smooth transitions to all interactive elements
- **Maintained:** Existing functionality while improving visual consistency and user experience

## [Unreleased] - Collection Page & Admin Style Options Update

### Completed

- The style (subcategory) dropdowns for both Male and Female outfits in the admin forms are now fully controlled by `data/products.ts`.
- The Collection page style dropdowns are dynamically populated from the database, reflecting all styles present in the product data.
- Adding a new style via the admin panel automatically updates the available options everywhere, ensuring consistency and reducing manual updates.
- The system is now robust and future-proof: updating styles in the admin or database is immediately reflected in all relevant dropdowns.

### No further action required for style/subcategory dropdown consistency.

## [Unreleased] - Buy Now Button Direct Checkout

### Fixed

- The Buy Now button on the product page now takes the user directly to checkout with only the selected product and quantity.
- The checkout flow is completely isolated from the cart: previous cart items are not included, and the cart remains unchanged.
- The checkout page automatically detects when a Buy Now purchase is in progress and displays only the selected product for the order summary and payment.
- This provides a true single-product, instant checkout experience, while preserving the user's cart for later.

## [Unreleased] - Checkout Form Details Correction

### Completed

- Removed the "Outfit Type" select box from the measurement form in checkout.
- Outfit type is now automatically determined from the product(s) being checked out:
  - For Buy Now: Uses the single product's type directly.
  - For Cart checkout: Uses the outfit type from each cart item.
- The user is no longer asked to select outfit type in the measurement form.
- The outfit type is still saved to Google Sheets, but is sourced from the product data, not user input.
- This approach supports both Buy Now (direct checkout) and Cart checkout flows.

## [Unreleased] - Google Sheets Multiple Products Formatting Improvement

### Completed

- **Improved Google Sheets formatting for multiple products in orders:**
  - Product images now display as multi-line text in a single cell (each image URL on its own line)
  - Product categories now display as multi-line text in a single cell (each category on its own line)
  - Product subcategories now display as multi-line text in a single cell (each subcategory on its own line)
- **Technical changes:**
  - Changed join separator from `; ` to `\n` (newline) for productImage, productCategory, and productSubCategory fields
  - This prevents text overflow into adjacent cells and makes the spreadsheet more readable
  - Each product's image/category/subcategory now appears on its own line within the same cell
- **Files modified:**
  - `app/api/orders/route.ts` - Updated join separators for better Google Sheets formatting

## [Unreleased] - Google Sheets Product(s) and Date/Time Formatting Improvements

### Completed

- **Product(s) cell:** Now displays each product name on a new line within a single cell for multi-product orders
- **Date and time cell:** Now displays as 'Date: YYYY-MM-DD' and 'Time: HH:MM:SS' on separate lines within the same cell
- **Product images:** Reverted to simple newline-separated URLs (removed HYPERLINK formula)
- **Technical changes:**
  - Updated join logic and formatting in `app/api/orders/route.ts` for productName and orderDate fields
  - Product images remain as simple URLs separated by newlines
- **Files modified:**
  - `app/api/orders/route.ts` - Improved formatting for Google Sheets export

## [Unreleased] - Home Page Improvements

### Completed

- **About Section:**
  - Displays a short summary by default
  - 'Read More' button opens a modal with extended, scrollable about text
- **Steps Section:**
  - 'Get Started' button now navigates to the collections page (`/collections`)
  - Step order updated: 1 is now 'Choose your style', 2 is 'Take your measurements', 3 is 'Perfect fit guarantee'
- **Files modified:**
  - `components/AboutSection.tsx`
  - `components/StepsSection.tsx`
