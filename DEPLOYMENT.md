# 🚀 Render Deployment Guide for Tadorado Fashion

## Prerequisites

- GitHub repository with your code
- Render account
- **Existing Aiven MySQL database** (already set up)
- Google Cloud service account (for Google Sheets integration)
- Firebase project (if using Firebase Storage)

## Step-by-Step Deployment

### 1. Web Service Setup (No Database Setup Needed!)

1. **Create Web Service:**

   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Choose the repository branch (usually `main`)

2. **Configure Build Settings:**
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `node server.js`
   - **Environment:** `Node`

### 2. Environment Variables

Add these environment variables in Render dashboard:

#### Required Variables:

```
DATABASE_URL=mysql://your_aiven_username:your_aiven_password@your_aiven_host:your_aiven_port/your_aiven_database
GOOGLE_SERVICE_ACCOUNT={"type":"service_account",...}
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SHEET_FILENAME=Tadorado
NODE_ENV=production
```

#### Optional (if using Firebase):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Node.js Compatibility:

```
NODE_OPTIONS=--openssl-legacy-provider
```

### 3. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Monitor the build logs for any errors

## Important Notes

### Database Connection

- **Keep your existing Aiven database** - no changes needed
- Just copy your current `DATABASE_URL` from your local `.env` file
- Make sure Aiven allows connections from Render's IP ranges

### Google Sheets Integration

- **No changes needed** - your existing setup will work
- Just copy your current Google service account and sheet configuration

## Troubleshooting

### Common Issues:

1. **Build Fails:**

   - Check if all dependencies are in `package.json`
   - Ensure Prisma schema is valid
   - Verify environment variables are set correctly

2. **Database Connection Issues:**

   - Verify your Aiven `DATABASE_URL` is correct
   - Check if Aiven allows external connections
   - Ensure your Aiven database is accessible from Render

3. **Google Sheets Integration Fails:**

   - Verify service account JSON is properly formatted
   - Check if Google Sheet is shared with service account
   - Ensure sheet ID is correct

4. **Node.js Version Issues:**
   - Add `NODE_OPTIONS=--openssl-legacy-provider` to environment variables
   - Or specify Node.js version in `package.json`

### Health Check:

- Render will automatically check `/` endpoint
- Ensure your homepage loads without errors
- Check application logs in Render dashboard

## Post-Deployment

1. **Test the Application:**

   - Visit your Render URL
   - Test product browsing
   - Test checkout flow
   - Verify Google Sheets export

2. **Monitor Logs:**

   - Check Render logs for any errors
   - Monitor database connections
   - Verify API endpoints are working

3. **Custom Domain (Optional):**
   - Add custom domain in Render settings
   - Update DNS records
   - Configure SSL certificate

## Support

If you encounter issues:

1. Check Render logs first
2. Verify all environment variables
3. Test locally with production environment
4. Contact Render support if needed

## Cost Optimization

- Render offers free tier for development
- Consider upgrading for production traffic
- Monitor usage and optimize accordingly
