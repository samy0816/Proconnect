# Deployment Guide for ProConnect

## Backend Deployment (Render)

### Step 1: Prepare Your Repository
Your backend is ready for deployment with the following configurations:
- ✅ `start` script added to package.json
- ✅ Dynamic PORT configuration
- ✅ render.yaml configuration file

### Step 2: Deploy on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
   - Sign up or log in

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `samy0816/Proconnect`

3. **Configure the Service**
   ```
   Name: proconnect-backend
   Region: Choose closest to your users
   Branch: master
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   Go to "Environment" tab and add:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkedin?retryWrites=true&w=majority
   HUGGING_FACE_API_KEY=hf_your_api_key_here
   ```
   
   ⚠️ **Important**: 
   - Use your actual MongoDB Atlas connection string
   - Replace `username` and `password` with your MongoDB credentials
   - Replace `cluster.mongodb.net` with your actual cluster URL
   - Use your actual Hugging Face API key

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://proconnect-backend.onrender.com`)

### Important Notes for Backend:
- Free tier on Render may spin down after inactivity
- First request after inactivity might take 30-60 seconds
- Consider upgrading for production use

---

## Frontend Deployment (Netlify)

### Step 1: Prepare Your Repository
Your frontend is ready with:
- ✅ netlify.toml configuration
- ✅ Environment variable support for API URL

### Step 2: Deploy on Netlify

1. **Go to [Netlify Dashboard](https://app.netlify.com/)**
   - Sign up or log in with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your repository: `samy0816/Proconnect`

3. **Configure Build Settings**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: .next
   ```

4. **Add Environment Variables**
   Go to "Site settings" → "Environment variables" and add:
   ```
   NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
   ```
   ⚠️ Replace with your actual Render backend URL from Step 1

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at a Netlify URL

6. **Optional: Custom Domain**
   - Go to "Domain settings"
   - Add your custom domain
   - Follow DNS configuration instructions

---

## Post-Deployment Steps

### 1. Update CORS Settings
Update your backend's CORS configuration to allow your Netlify domain:

```javascript
// In backend/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-netlify-site.netlify.app'
  ]
}));
```

### 2. Test Your Deployment
- Visit your Netlify URL
- Try logging in/signing up
- Test post creation
- Test AI features
- Verify image uploads work

### 3. Monitor Your Apps
- **Render**: Check logs in Render dashboard
- **Netlify**: Check build logs and function logs

---

## Troubleshooting

### Backend Issues
- **Error: MongoDB connection failed**
  - Verify MONGO_URL in Render environment variables
  - Check if MongoDB Atlas IP whitelist includes 0.0.0.0/0

- **Error: 503 Service Unavailable**
  - Free tier may be spinning up (wait 30-60 seconds)
  - Check Render logs for errors

### Frontend Issues
- **API calls failing**
  - Verify NEXT_PUBLIC_API_URL is set correctly
  - Check CORS settings on backend
  - Verify backend is running

- **Build fails**
  - Check build logs in Netlify
  - Ensure all dependencies are in package.json
  - Verify Node version compatibility

### AI Features Not Working
- Verify HUGGING_FACE_API_KEY is set in Render
- Check backend logs for API errors
- Ensure API key has proper permissions

---

## Environment Variables Summary

### Backend (Render)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkedin?retryWrites=true&w=majority
HUGGING_FACE_API_KEY=hf_xxxxxxxxxxxxx
```

Note: PORT is automatically set by Render, no need to add it manually.

### Frontend (Netlify)

**CRITICAL**: You MUST set the API URL in TWO places:

#### 1. In `netlify.toml` file (line 13):
```toml
NEXT_PUBLIC_API_URL = "https://your-backend-name.onrender.com"
```

#### 2. In Netlify Dashboard:
- Go to Site settings → Environment variables
- Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-name.onrender.com`

**Important Notes:**
- Replace `your-backend-name` with your actual Render backend URL
- NO trailing slash at the end of the URL
- The URL should start with `https://`
- After updating, trigger a **manual redeploy** in Netlify (Deploys → Trigger deploy → Clear cache and deploy)

---

## Costs

### Render (Backend)
- **Free Tier**: 750 hours/month, spins down after 15min inactivity
- **Starter Plan**: $7/month for always-on service

### Netlify (Frontend)
- **Free Tier**: 100GB bandwidth, 300 build minutes/month
- **Pro Plan**: $19/month for more resources

---

## Quick Deploy Commands

After pushing your code to GitHub, both platforms will auto-deploy on new commits!

```bash
# Push updates
git add .
git commit -m "Update application"
git push origin master
```

Both Render and Netlify will automatically rebuild and deploy! 🚀
