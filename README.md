# The Human Tech Blog — by Deolindo Baptista

**The Human Tech Blog** is a professional, scalable and multilingual blog platform with a modern, modular architecture and a full-featured admin panel.  
It’s designed for tech writers and editorial teams, providing secure content management, rich formatting, real-time notifications, and seamless integration with a robust backend.

**Backend repo:** [The Human Tech Blog Server](https://github.com/Deobap73/The-Human-Tech-Blog-Server)

---
<br>
## 🚀 Features

- 🔒 **Authentication:** JWT, session, roles (Admin/Editor)
- 🌐 **Multilingual:** Full CRUD for Posts, Categories, Tags, Notifications (EN, PT, DE, ES)
- 📑 **Rich Editor:** Create/edit posts with Cloudinary image upload
- ⚡ **Admin Dashboard:** Tabs per resource, multilanguage forms, inline editing
- 🏷️ **Tags & Categories:** Fully translated, assign to posts
- 📨 **Notifications:** Real-time, multilanguage, admin management
- 💬 **Comments & Chat:** Moderation, threaded comments, and real-time chat (Socket.IO)
- 🔔 **Bookmarks & Newsletter:** Subscribe to posts/categories, manage newsletters
- 🔎 **Full-text Search:** Filters, autocomplete, relevance
- 🌗 **Theme:** Light/Dark mode, context-driven
- 🧠 **Type-Safe & Modular:** Strict TypeScript, SCSS BEM, clear structure
- 🛡️ **Security:** CSRF, rate-limiting, RBAC, 2FA (admin)
- 📦 **API-first:** Axios services, hooks, i18n, custom context

---
<br>
## 🏗️ Tech Stack

| Category      | Tech Stack                                 |
| ------------- | ------------------------------------------ |
| Frontend      | React 18, TypeScript, Vite, React Router   |
| Styling       | SCSS (BEM methodology), modular components |
| Auth          | JWT, roles (admin/editor), context         |
| State Mgmt    | React Context, custom hooks                |
| Data Fetching | Axios, custom API services                 |
| Rich Editor   | Tiptap/React Quill                         |
| Uploads       | Cloudinary, Unsigned Preset                |
| Real-time     | Socket.IO                                  |
| International | i18next, multilanguage resources           |

---
<br>
## 📁 Project Structure

```txt
src/
├── App.tsx                      # Routing + Provider Composition
├── features/                    # Modular by domain (post, admin, auth, etc)
│   ├── admin/                   # Admin pages, components, styles
│   ├── post/                    # Public/post features
│   ├── tag/                     # Tags management
│   ├── notification/            # Notifications system
│   ├── category/                # Categories system
│   └── ...                      # (user, chat, newsletter, etc)
├── shared/                      # Common utils, types, services
│   ├── context/                 # Auth, Socket, Theme, i18n
│   ├── hooks/                   # Custom hooks (usePosts, useAuth, etc)
│   ├── services/                # API services per resource
│   ├── types/                   # All TypeScript interfaces
│   └── utils/                   # Helper functions (axios, validation)
├── styles/                      # Global and feature SCSS (BEM)
├── i18n/                        # i18next setup and translations
├── main.tsx
└── vite.config.ts
```

---
<br>
## 🌍 Internationalization

- Full multilanguage: All public and admin resources in EN, PT, DE, ES

- Admin: Tabbed translation forms for posts, categories, tags, notifications

- Language context: i18next with dynamic switching

---
<br>
## 🖼️ Cloudinary Image Upload

Images are uploaded directly to Cloudinary using unsigned upload presets.

Setup:

1.  Create an unsigned upload preset in Cloudinary dashboard

2.  Add to `.env`:

```txt
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

---
<br>
## 🔒 Security & Best Practices

- Strict TypeScript, ESLint, Prettier

- CSRF, rate limiting, JWT + refresh, 2FA for admins (backend)

- ole-based access (admin/editor/user)

- odular SCSS (BEM), code comments

- Commit messages in English, phase-based workflow

- Error boundaries, toast notifications

---
<br>
## 🛠️ Scripts

```txt
npm run dev       # Start dev server
npm run build     # Build production
npm run preview   # Preview build
```
---
<br>
## 📦 API Endpoints (Expectations)

- Auth: /auth/login (JWT, role)

- Posts: /posts, /posts/:id, /posts/upload

- Categories: /categories, /categories/:id

- Tags: /tags, /tags/:id

- Notifications: /notifications

- Media: /posts/upload

- International: Multilanguage fields in all POST/PATCH

---
<br>
### See backend [README](https://github.com/Deobap73/The-Human-Tech-Blog-Server) for more routes.
## ✅ Engineering Checklist

- Type safety (strict TS everywhere)

- Modular SCSS (BEM)

- Contexts: auth, socket, theme, i18n

- API services per domain

- Hooks for business logic

- Toast notifications

- Admin CRUD with multilanguage tabs

- Image upload integration

---
<br>

## Security best practices

### 🧪 Manual QA & Testing

- Create/edit/delete posts in all languages

- Switch languages and see correct translations

- Assign/remove tags and categories (CRUD)

- Upload and preview images in admin

- Receive and read notifications

- Search/filter posts

- Login/logout, session persistence

---
<br>

### 👤 Author

Built and maintained by Deolindo Baptista
MIT License.
For personal and learning use only.

---
<br>

## 🤝 Contributions

- Fork & create a branch (feat/my-feature)

- Commit with clear messages in English

- Open a pull request

---
<br>

## 📝 Final Notes

This project is audit-reviewed, extensible, and ready for real-world use in professional blogging and editorial teams.
For backend details, see: The Human Tech Blog Server.

Happy building & writing! 🚀

```
