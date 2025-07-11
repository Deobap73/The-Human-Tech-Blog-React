# [_The Human Tech Blog_](https://thehumantechblog.com) — by Deolindo Baptista

**The Human Tech Blog** is a professional, scalable and multilingual blog platform with a modern, modular architecture and a full-featured admin panel.
It’s designed for tech writers and editorial teams, providing secure content management, rich formatting, real-time notifications, and seamless integration with a robust backend.
<br> <br>
<img src="https://github.com/Deobap73/The-Human-Tech-Blog-React/blob/main/public/images/HomePage.webp">
<br> <br>
**Backend repo:** [The Human Tech Blog Server](https://github.com/Deobap73/The-Human-Tech-Blog-Server)

---

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
- 🛠️ **Professional DevOps Workflow:** CLI scripts for database reset & admin setup (see backend repo), English commit messages, and phase-based workflow adopted in the full stack.

---

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

## 📁 Project Structure (Frontend)

```txt
The-Human-Tech-Blog-React/
├── .env               # Environment configurations (never commit secrets!).
├── .env.local         # Local Environment configurations (never commit secrets!).
├── .env.production    # Environment configurations in production (never commit secrets!).
├── .eslintrc.cjs             # ESLint configuration for TypeScript and code linting.
├── .gitignore                # Git ignore rules for dependencies, build output, environment files, etc.
├── .npmrc                    # Node.js/npm version management and registry config.
├── .nvmrc                    # Node.js/npm version management and registry config.
├── index.html                # Main HTML file used by Vite to bootstrap the React app.
├── package-lock.json         # Project dependencies, scripts, and metadata.
├── package.json              # Project dependencies, scripts, and metadata.
├── public/                   # Public static assets (images, favicon, etc.) served directly at the root.
│   └── images/
│       └── ...
├── README.md                 # Main project documentation, features, and usage instructions.
├── scripts/                  # Node/TypeScript scripts for automation (fixing imports, migrations, structure helpers, etc.).
│   └── ...
├── src/                      # Main source code folder for all application logic, UI and assets
│   ├── App.tsx               # Root React component, routes and providers composition.
│   ├── assets/               # Local image and media assets (imported by components).
│   ├── features/             # Modular domain-based feature folders, all business logic and UI blocks.
│   │   ├── about/            # About page, timeline, author intro, and related assets/styles.
│   │   ├── admin/            # Full-featured admin dashboard: pages, tables, filters, forms, and styles.
│   │   ├── auth/             # Authentication pages, login/register modals, and session logic.
│   │   ├── chat/             # Real-time chat: chat window, sidebar, message input/viewer, chat SCSS (BEM).
│   │   ├── contact/          # Contact page, form, info and map sections.
│   │   ├── home/             # Home/Landing page, main hero, and related content.
│   │   ├── layout/           # Application shell: Navbar, Footer, Layout and theme toggle components.
│   │   ├── newsletter/       # Newsletter form and logic.
│   │   ├── notification/     # Notification bell, notification list, and notification page.
│   │   ├── post/             # All blog post logic: editor, post list, card, comments, categories, etc.
│   │   ├── reaction/         # Reaction buttons and real-time reactions (like/emoji support).
│   │   ├── search/           # Search bar and search results pages.
│   │   ├── sponsors/         # Sponsors widget/component.
│   │   ├── tag/              # Tag pages and tag management logic.
│   │   ├── ui/               # Generic reusable UI components (pagination, etc)
│   │   └── user/             # User profile, edit profile, user posts/comments/bookmarks.
│   ├── Fonts/                # Custom font files used throughout the app.
│   ├── i18n/                 # Internationalization setup and translation files.
│   ├── main.tsx              # App entry point: mounts the root React app to the DOM.
│   ├── pages/                # Misc. global pages (e.g., NotAuthorized).
│   ├── routes/               # Application route definitions and guards (private/public/admin routes).
│   ├── shared/               # Shared utilities, hooks, services, context, types, used across all features.
│   ├── styles/               # Global SCSS, variables, resets, and global BEM style helpers.
│   └── vite-env.d.ts         # TypeScript Vite environment declarations
├── theHumanTechBlogLogo.webp # Main logo for the application (brand asset).
├── tsconfig.app.json         # TypeScript configuration for app, node, and strict mode settings.
├── tsconfig.json             # TypeScript configuration for app, node, and strict mode settings.
├── tsconfig.node.json        # TypeScript configuration for app, node, and strict mode settings.
└── vite.config.ts            # Vite bundler configuration file.
```

---
<br> <br>
<img src="https://github.com/Deobap73/The-Human-Tech-Blog-React/blob/main/public/images/TechShortsPage.webp">
<br> <br>

---
## 🌍 Internationalization

- Full multilanguage: All public and admin resources in EN, PT, DE, ES
- Admin: Tabbed translation forms for posts, categories, tags, notifications
- Language context: i18next with dynamic switching

---

## 🖼️ Cloudinary Image Upload

Images are uploaded directly to Cloudinary using unsigned upload presets.

Setup:

1. Create an unsigned upload preset in Cloudinary dashboard
2. Add to `.env`:

```txt
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

---

## 🔒 Security & Best Practices

- Strict TypeScript, ESLint, Prettier
- CSRF, rate limiting, JWT + refresh, 2FA for admins (backend)
- Role-based access (admin/editor/user)
- Modular SCSS (BEM), code comments
- Commit messages in English, phase-based workflow
- Error boundaries, toast notifications
- **End-to-end DevOps: all database reset and admin setup scripts handled in backend, see backend [README](https://github.com/Deobap73/The-Human-Tech-Blog-Server) for details.**

---

## 🛠️ Scripts

```txt
npm run dev       # Start dev server
npm run build     # Build production
npm run preview   # Preview build
```

---

## 📦 API Endpoints (Expectations)

- Auth: /auth/login (JWT, role)
- Posts: /posts, /posts/\:id, /posts/upload
- Categories: /categories, /categories/\:id
- Tags: /tags, /tags/\:id
- Notifications: /notifications
- Media: /posts/upload
- International: Multilanguage fields in all POST/PATCH

See backend [README](https://github.com/Deobap73/The-Human-Tech-Blog-Server) for complete routes, database operations, and DevOps scripts.

---

## ✅ Engineering Checklist

- Type safety (strict TS everywhere)
- Modular SCSS (BEM)
- Contexts: auth, socket, theme, i18n
- API services per domain
- Hooks for business logic
- Toast notifications
- Admin CRUD with multilanguage tabs
- Image upload integration
- **Full-stack tested and audit-reviewed, phase-based development and commit workflow adopted throughout the project.**

---

## 💬 Chat Module — Features & Experience

The **Chat module** in The Human Tech Blog provides a modern, secure, and seamless real-time messaging experience, tailored for editorial teams, technical communities, and collaborative environments.

### Key Features

- **Real-time Messaging:**  
  Instant send/receive of messages using WebSocket (Socket.IO) for true real-time updates.

  ---
<br> <br>
<img src="https://github.com/Deobap73/The-Human-Tech-Blog-React/blob/main/public/images/ContactPage.webp">
<br> <br>

---

- **Chat Sidebar (Conversation List):**

  - Displays all conversations with avatars, usernames, preview of the latest message, and unread message badges.
  - Instant search for users/conversations.
  - New conversation or group chat button (future-proofed for group features).

- **Chat Window:**

  - Full message history, grouped by day.
  - Send and receive text (image/file upload planned).
  - Distinct styling for sent vs received messages.
  - Display sender, timestamp, and formatted message content.
  - Image preview before upload for better UX.
  - Auto-scroll to the latest message on new updates.

- **Design & Usability:**

  - Card-like layout with realistic texture, central “crease” effect, and decorative pencil image for a unique handwritten-inspired feel.
  - Invisible scrollbars: natural scrolling without visual clutter.
  - Responsive design:
    - Desktop/tablet: Sidebar and window displayed side-by-side as cards.
    - Mobile: Only one view at a time, for focus and clarity.

- **Accessibility & Experience:**
  - Full keyboard navigation.
  - Focus indicators for all interactive elements.
  - ARIA labels and roles on all buttons and form fields.

### Technical Stack

- **Frontend:**  
  React 18, strict TypeScript, SCSS (BEM), relative imports  
  Components and business logic fully modular (`/features/chat/`)

- **Backend:**  
  Integrated with [The Human Tech Blog Server](https://github.com/Deobap73/The-Human-Tech-Blog-Server) via REST API and Socket.IO for real-time chat.

- **Roadmap & Future Improvements:**
  - Message reactions/emojis
  - Chat-specific notifications
  - Group chats
  - Message search
  - Voice/video calls (extensible architecture)

---
<br> <br>
<img src="https://github.com/Deobap73/The-Human-Tech-Blog-React/blob/main/public/images/ContactPage.webp">
<br> <br>

---

**Summary:**  
The Chat module offers a professional, modern, and accessible messaging experience—backed by clean, modular, and audit-ready code, ready for future expansion as the community’s needs evolve.

---

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

## 👤 Author

Built and maintained by Deolindo Baptista
MIT License.
For personal and learning use only.

---

## 🤝 Contributions

- Fork & create a branch (feat/my-feature)
- Commit with clear messages in English
- Open a pull request

---

## 📝 Final Notes

This project is audit-reviewed, extensible, and ready for real-world use in professional blogging and editorial teams.
For backend details and full DevOps setup, see: The Human Tech Blog Server.

Happy building & writing! 🚀
