# Admin Dashboard Testing Guide & RBAC Access Matrix

This document provides a detailed breakdown of the Role-Based Access Control (RBAC) implementation in the Legend Photography Admin Dashboard, along with testing credentials.

## Login URL
[http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 1. RBAC Test Accounts

Use the following accounts to test the dashboard permissions.

| Role | Email ID | Password | Main Purpose |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | `admin@legend.com` | `SecurePassword123!` | System Owner. Has absolute control over everything. |
| **ADMIN** | `test_admin@legend.com` | `AdminPassword123!` | Studio Manager. Handles leads, settings, and business operations. |
| **EDITOR** | `test_editor@legend.com` | `EditorPassword123!` | Content Creator. Only manages photos, videos, and albums. |

*(Note: If the `ADMIN` and `EDITOR` accounts do not exist in your local database, you can seed them by visiting: [http://localhost:3000/api/seed-users](http://localhost:3000/api/seed-users) in your browser.)*

---

## 2. Detailed Permission Matrix

The following table details exactly which features and actions are accessible by each role. 

| Feature / Module | Action | SUPER_ADMIN | ADMIN | EDITOR |
| :--- | :--- | :---: | :---: | :---: |
| **Dashboard (Overview)** | View metrics & unread counts | ✅ | ✅ | ❌ |
| **Portfolio (Albums)** | Create, Edit, Publish, Delete | ✅ | ✅ | ✅ |
| **Media Library** | Upload, Preview, Delete | ✅ | ✅ | ❌ |
| **Inquiries (CRM)** | View, Filter, Change Status, Add Notes | ✅ | ✅ | ❌ |
| **Films (Video Reels)** | Create, Edit, Publish, Delete | ✅ | ✅ | ✅ |
| **Services (Packages)** | Edit details, Pricing, Enable/Disable | ✅ | ✅ | ❌ |
| **Homepage Content** | Update Hero Text, Featured Sections | ✅ | ✅ | ✅ |
| **Site Settings** | Update Contact Info, Socials, Footer | ✅ | ✅ | ❌ |
| **Audit Logs** | View history of all admin actions | ✅ | ✅ | ❌ |
| **User Management** | Create, Edit, Deactivate Admins/Editors | ✅ | ❌ | ❌ |

### Role Deep-Dive

#### 👑 SUPER_ADMIN
- **Who uses this?** The business owner or lead developer.
- **What they can do:** They have unchecked access to the entire platform. They are the only ones who can view the "Users" panel to create new `ADMIN` or `EDITOR` accounts, reset passwords, or block accounts. They can also view the Audit Logs to see what the other admins are doing.

#### 💼 ADMIN
- **Who uses this?** Studio managers or sales representatives.
- **What they can do:** They handle the business side. When a client submits an inquiry, the `ADMIN` gets a notification, views the client's details, changes the status to "Contacted", and adds internal notes. They can also update pricing in the "Services" tab, upload photos to the Media Library, and change the company phone number in "Settings".
- **What they CANNOT do:** They cannot access the User Management panel. They cannot delete the `SUPER_ADMIN` or create new users.

#### 🎨 EDITOR
- **Who uses this?** Freelance photo editors, interns, or social media managers.
- **What they can do:** They handle the creative side. They can create new Portfolio albums, arrange the order of photos, and update YouTube links for the Films section. They can also update the featured text on the Homepage.
- **What they CANNOT do:** They are completely blocked from viewing sensitive business data. They cannot see client Inquiries, cannot change Service pricing, cannot access global Settings, and cannot see Audit Logs or Users.

---

## 3. How to Test End-to-End

1. **Test SUPER_ADMIN:** 
   - Log in as `admin@legend.com`. 
   - Navigate through every tab to ensure they are all visible.
   - Go to User Management (if available) to verify you can see the test accounts.
2. **Test ADMIN:** 
   - Log out and log back in as `test_admin@legend.com`.
   - Verify that the **Users** tab is hidden.
   - Try to manually navigate to `/admin/users` in the URL bar—you should be blocked or redirected.
3. **Test EDITOR:** 
   - Log out and log back in as `test_editor@legend.com`.
   - Verify that **Inquiries**, **Settings**, **Services**, and **Media** tabs are hidden.
   - Try to navigate to `/admin/settings` in the URL bar—you should be blocked.
