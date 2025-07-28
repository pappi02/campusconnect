# Campus Connect - Network Access Setup Guide

## 🌐 Making Your Website Available on Your Local Network

Your Campus Connect website is now configured to be accessible by anyone connected to your local network!

## 📋 Quick Start

### Option 1: Use the Batch Script (Recommended)
1. Double-click `start_network_servers.bat`
2. Both servers will start automatically
3. Share the URLs with your network users

### Option 2: Manual Start
1. **Start Backend Server:**
   ```bash
   cd backend
   python manage.py runserver 172.16.223.198:8000
   ```

2. **Start Frontend Server:**
   ```bash
   cd frontend
   npm run dev
   ```

## 🔗 Network Access URLs

- **Frontend (Main Website):** `http://172.16.223.198:5173`
- **Backend API:** `http://172.16.223.198:8000`
- **Admin Panel:** `http://172.16.223.198:8000/admin`

## 👥 For Network Users

Anyone connected to your network can now access the website by visiting:
**`http://172.16.223.198:5173`**

## 🔧 What Was Configured

### Backend (Django) Changes:
- ✅ Added your IP `172.16.223.198` to `ALLOWED_HOSTS`
- ✅ Updated CORS settings to allow network requests
- ✅ Updated CSRF trusted origins for security
- ✅ Configured to accept connections from `0.0.0.0`

### Frontend (React/Vite) Changes:
- ✅ Set host to `0.0.0.0` to accept network connections
- ✅ Updated proxy to point to your network IP
- ✅ Configured for network accessibility

## 🛡️ Security Notes

- This configuration is for **local network development only**
- Do not use these settings in production
- Your website is only accessible within your local network
- External internet users cannot access it

## 🔍 Troubleshooting

### If users can't access the website:

1. **Check Windows Firewall:**
   - Go to Windows Defender Firewall
   - Allow Python and Node.js through firewall
   - Or temporarily disable firewall for testing

2. **Verify Network Connection:**
   - Ensure all devices are on the same network
   - Check if you can ping your IP: `ping 172.16.223.198`

3. **Check Server Status:**
   - Make sure both servers are running
   - Check for any error messages in the terminal

4. **Alternative IP Check:**
   - Your IP might change. Run `ipconfig` to get current IP
   - Update the configuration files if IP changed

## 📱 Mobile Access

Mobile devices on the same network can access the website by:
1. Connecting to the same WiFi network
2. Opening browser and going to: `http://172.16.223.198:5173`

## 🔄 If Your IP Changes

If your computer gets a new IP address:
1. Run `ipconfig` to get the new IP
2. Update `backend/campus_delivery/settings.py`:
   - Update `ALLOWED_HOSTS`
   - Update `CORS_ALLOWED_ORIGINS`
   - Update `CSRF_TRUSTED_ORIGINS`
3. Update `frontend/vite.config.js`:
   - Update the proxy target URL
4. Update `frontend/.env`:
   - Update `VITE_API_BASE_URL`
5. Update `frontend/src/api.js`:
   - Update the fallback baseURL
6. Update `start_network_servers.bat` with new IP

## 🐛 Common Issues & Solutions

### "Failed to load data" Error
This usually means the API calls are not reaching the backend:

1. **Check if both servers are running:**
   - Backend should be at `http://172.16.223.198:8000`
   - Frontend should be at `http://172.16.223.198:5173`

2. **Test API directly:**
   - Try accessing `http://172.16.223.198:8000/api/products/` in browser
   - Should return JSON data, not an error

3. **Check Windows Firewall:**
   - Allow Python.exe and Node.js through Windows Firewall
   - Or temporarily disable firewall for testing

4. **Restart servers:**
   - Close both terminal windows
   - Run `start_network_servers.bat` again

### Network Users Can't Access
1. **Verify same network:** All devices must be on same WiFi/network
2. **Test connectivity:** From other device, try `ping 172.16.223.198`
3. **Check firewall:** Windows Firewall might be blocking connections
4. **Try different browser:** Sometimes browser cache causes issues

### API Calls Failing
1. **Check browser console:** Press F12 and look for error messages
2. **CORS errors:** Make sure CORS settings include your IP
3. **Network timeouts:** Increase timeout in `frontend/src/api.js`

## 🎉 Success!

Your Campus Connect website is now available to everyone on your network! Share the URL `http://172.16.223.198:5173` with your friends, colleagues, or anyone on your local network.

---

**Need help?** Check the terminal output for any error messages or contact your developer.
