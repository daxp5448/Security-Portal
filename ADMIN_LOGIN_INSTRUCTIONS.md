# How to Access the Admin Panel

## ⚠️ IMPORTANT: You MUST Login First!

The admin panel requires authentication. All the 403 Forbidden errors you're seeing are because you're trying to access admin pages **without logging in as admin first**.

## Step-by-Step Instructions:

### 1. Open the Application
- Click the **preview button** in your IDE, OR
- Go to: `http://127.0.0.1:5174`

### 2. Navigate to Login
- Go to `/login` in the browser
- You should see the login page

### 3. Login as Admin
Use these credentials:
- **Email:** `admin@sentinel.com`
- **Password:** `AdminPass123`

### 4. Automatic Redirect
- After successful login, you'll be **automatically redirected** to `/admin/dashboard`
- The admin panel will now work correctly!
- All data will be fetched from PostgreSQL

### 5. Verify It Works
You should see:
- ✅ Total Users count
- ✅ Active Incidents
- ✅ Resolved Cases
- ✅ Security Score
- ✅ Live Security Feed (audit logs)
- ✅ Charts and graphs

## Available Admin Credentials:

### Admin Account:
- Email: `admin@sentinel.com`
- Password: `AdminPass123`
- Role: Admin (full access)

### Moderator Account:
- Email: `moderator@sentinel.local`
- Password: (you can set one via backend)
- Role: Moderator (can access most admin features)

## What You'll See After Login:

### Dashboard (`/admin/dashboard`)
- Real-time statistics from PostgreSQL
- User counts, incident reports
- Live security feed
- Threat map visualization

### Users (`/admin/users`)
- List of all registered users from database
- Change user roles (dropdown)
- Block/unblock users (shield icon)
- Delete users
- Create new users

### Threats (`/admin/threats`)
- All reported incidents from database
- Incident details and status

### Analytics (`/admin/analytics`)
- Charts with real data
- Incident trends
- Dangerous areas
- Category breakdowns

### And More!
- Dispatch Panel
- Officers Management
- Security Operations
- Audit Logs
- Reports Export

## Troubleshooting:

### "403 Forbidden" Errors
**Cause:** You're not logged in or using a regular user account
**Solution:** Login with admin credentials listed above

### "Authentication Required" Message
**Cause:** Token expired or invalid
**Solution:** Logout and login again with admin credentials

### Can't See Admin Dashboard
**Cause:** You logged in with a regular user account
**Solution:** Logout and login with `admin@sentinel.com`

## Quick Test:

Run this in PowerShell to verify admin login works:
```powershell
$body = @{username="admin@sentinel.com"; password="AdminPass123"}
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/auth/login" -Method POST -Body $body
Write-Host "Token: $($response.access_token)"
Write-Host "Role: $($response.role)"
```

You should see `Role: admin` in the output.

---

**Remember:** The admin panel is now protected and requires proper authentication. Always login first! 🔐
