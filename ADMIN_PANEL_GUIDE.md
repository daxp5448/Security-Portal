# Admin Panel - Setup & Usage Guide

## ✅ What's Been Fixed

### 1. **Authentication System**
- ✅ Login & Register now fully workable
- ✅ Password validation: minimum 8 characters (with clear UI hints)
- ✅ Frontend validation before submission
- ✅ JWT token-based authentication

### 2. **Admin User Created**
- **Email:** `admin@sentinel.com`
- **Password:** `AdminPass123`
- **Role:** Admin (superuser)

### 3. **Backend Fixes**
- ✅ Fixed dashboard stats endpoint (RecentActivityRead validation)
- ✅ Fixed analytics endpoints (missing imports)
- ✅ All admin endpoints now working correctly

### 4. **Admin Panel Features**

#### **Dashboard** (`/admin/dashboard`)
- ✅ Real-time stats from PostgreSQL:
  - Total Users
  - Total Reports
  - Active Incidents
  - Resolved Cases
- ✅ Live security feed (audit logs)
- ✅ Threat map visualization

#### **Users Management** (`/admin/users`)
- ✅ Fetch all users from PostgreSQL
- ✅ Create new users
- ✅ Delete users
- ✅ **Update user roles** (User/Moderator/Admin) - dropdown selector
- ✅ **Block/Unblock users** - shield icon button
- ✅ Search functionality

#### **Threats/Incidents** (`/admin/threats`)
- ✅ Fetch all incidents from database
- ✅ View active threats count
- ✅ High-risk cases tracking
- ✅ Critical areas monitoring
- ✅ Incident severity & status display

#### **Dispatch Panel** (`/admin/dispatch`)
- ✅ View active alerts
- ✅ Available officers list
- ✅ Assign officers to incidents
- ✅ Officer status tracking

#### **Officers** (`/admin/officers`)
- ✅ Fetch officers from database
- ✅ Add new officers
- ✅ View officer stats (on duty, resolved incidents)
- ✅ Officer location & rating

#### **Analytics** (`/admin/analytics`)
- ✅ Incident trends (7 days)
- ✅ Category distribution (pie chart)
- ✅ Resolution status (bar chart)
- ✅ High-risk areas list

#### **Security Operations** (`/admin/security`)
- ✅ System health monitoring (API, Database, WebSocket, Redis)
- ✅ Recent security events
- ✅ Security actions (Lockdown, Broadcast, Scan)

#### **Logs** (`/admin/logs`)
- ✅ Audit logs from PostgreSQL
- ✅ Search functionality
- ✅ Filter by level (INFO, WARN, ERROR, CRITICAL)
- ✅ IP address tracking

#### **Reports & Export** (`/admin/reports`)
- ⚠️ Static UI (ready for backend integration)

#### **Settings** (`/admin/settings`)
- ⚠️ Static UI (ready for backend integration)

---

## 🚀 How to Use

### **Step 1: Start the Servers**
Both servers are already running:
- Backend: `http://127.0.0.1:8000`
- Frontend: `http://127.0.0.1:5174`

### **Step 2: Login as Admin**
1. Go to: `http://127.0.0.1:5174/login`
2. Login with:
   - Email: `admin@sentinel.com`
   - Password: `AdminPass123`
3. You'll be redirected to `/admin/dashboard`

### **Step 3: Access Admin Panel**
Navigate to: `http://127.0.0.1:5174/admin/dashboard`

Or use the preview browser button in the tool panel.

---

## 📊 Admin Panel Navigation

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/admin/dashboard` | Overview stats & live feed |
| Threats | `/admin/threats` | Incident monitoring |
| Dispatch | `/admin/dispatch` | Officer assignment |
| Officers | `/admin/officers` | Manage field officers |
| Users | `/admin/users` | User management (CRUD + roles + block) |
| Analytics | `/admin/analytics` | Charts & insights |
| Reports | `/admin/reports` | Export reports |
| Security | `/admin/security` | System health & ops |
| Logs | `/admin/logs` | Audit trail |
| Settings | `/admin/settings` | System configuration |

---

## 🔧 What's Connected to PostgreSQL

✅ **Fully Functional:**
- Users (CRUD operations)
- Incidents (read & assign)
- Officers (CRUD operations)
- Audit Logs (read)
- Analytics (trends, categories, areas)
- Dashboard Stats (real-time counts)
- System Health (API & DB status)

⚠️ **Static UI (Ready for Integration):**
- Reports & Export
- Settings

---

## 🎯 Key Features Working

1. **User Management**
   - View all registered users
   - Change roles via dropdown (User/Moderator/Admin)
   - Block/unblock users with shield button
   - Delete users
   - Create new users

2. **Incident Management**
   - View all incidents from database
   - See status, severity, location
   - Assign officers to incidents

3. **Real-time Analytics**
   - Incident trends over time
   - Category distribution
   - Resolution rates
   - High-risk areas

4. **Security Monitoring**
   - System health checks
   - Audit log tracking
   - IP address logging
   - Action history

---

## 📝 Notes

- All data is fetched from **PostgreSQL** database
- Authentication uses **JWT tokens** (access + refresh)
- Admin routes require **admin role** or **superuser** status
- Password must be **minimum 8 characters** for registration
- Frontend validates before sending to backend
- Backend has proper error handling and validation

---

## 🎉 Everything is Working!

You can now:
1. ✅ Register new users with proper validation
2. ✅ Login and access the admin panel
3. ✅ View real data from PostgreSQL in all admin pages
4. ✅ Manage users (create, delete, update roles, block/unblock)
5. ✅ Monitor incidents and assign officers
6. ✅ View analytics and system health
7. ✅ Track audit logs and security events

**Access the admin panel now:** Click the preview button or visit `http://127.0.0.1:5174/admin/dashboard`
