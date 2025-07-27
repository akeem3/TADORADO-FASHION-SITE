# Changelog

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

### Remaining Issues

- [ ] Checkout form details correction
- [ ] Collection page (Styles details Update)
- [ ] Home Page (improve steps section, buttons, Testimonials)
- [ ] Node mailer (email sent to admin once an order is made)
