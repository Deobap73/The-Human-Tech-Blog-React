# <h1 align="center" >The Human Tech Blog — by Deolindo Baptista </h1>

**The Human Tech Blog** is a clean, scalable and professional blog platform developed using modern frontend technologies.  
It empowers tech writers to share content with rich formatting, dynamic theming, and full control over posts and categories.
Also a robust, secure, and scalable backend built with Node.js, Express, and TypeScript to power the **The Human Tech Blog**.
[The backend ](https://github.com/Deobap73/The-Human-Tech-Blog-Server) manages post creation, authentication, comments, and category APIs, integrated with MongoDB and JWT-based access control.

<br>

<br>

---

<br>

## 🚀 Features

- 🔐 **Authentication** (mock JWT-based with persistent session)
- ✍️ **Write page** with [React Quill](https://github.com/zenoamaro/react-quill) WYSIWYG editor
- 🌗 **Theme switcher** — light/dark with global context
- 📸 **Image upload** to Cloudinary via API
- 📄 **Category filtering**, pagination and dynamic blog routes
- ⚡ **API integration** with Axios and JWT injection
- 🧠 **Modular architecture** (Pages, Components, Context, Hooks, Utils)

<br>

---

<br>

## 🏗️ Technologies Used

| Category      | Tech Stack                            |
| ------------- | ------------------------------------- |
| Frontend      | React, TypeScript, Vite, React Router |
| Styling       | CSS Modules                           |
| Auth          | JWT (via `localStorage`)              |
| State Mgmt    | React Context API                     |
| Data Fetching | Axios + SWR                           |
| Rich Editor   | React Quill (Bubble Theme)            |
| Uploads       | Cloudinary                            |

<br>

---

<br>

## 📁 Project Structure

```txt
src/
├── App.tsx                   # Routing + Provider Composition
├── pages/                    # Page-level Components
│   ├── HomePage.tsx
│   ├── BlogPage.tsx
│   ├── posts/slug/           # Dynamic Routing
│   ├── WritePage.tsx
│   └── LoginPage.tsx
├── components/               # UI + Layout Components
├── context/                  # Auth & Theme Contexts
├── providers/                # Context Wrappers (Theme)
├── hooks/                    # Custom Hooks (ex: usePosts)
├── utils/                    # API, Types, Constants, Storage
```

<br>

---

<br>

# Environment Setup

1. Clone the repository

```txt
git clone [git@github.com:Deobap73/The-Human-Tech-Blog.git](git@github.com:Deobap73/The-Human-Tech-Blog-React.git)
cd The-Human-Tech-Blog
```

3. Install dependencies

```txt
   npm install
```

4. Configure environment variables
   - Create a .env file at the root and define:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

<br>

---

<br>

## 🖼️ Cloudinary Integration

Images added in the post creation page are uploaded to [Cloudinary](https://cloudinary.com/) using unsigned upload presets.

### Setup:

1. Go to your Cloudinary account dashboard.
2. Create an **upload preset** (unsigned).
3. Add this to your `.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=[ Your CLOUD_NAME]
VITE_CLOUDINARY_UPLOAD_PRESET=[Your UPLOAD_PRESET]
```

<br>

---

<br>

## 🛠️ Scripts

```txt
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```

<br>

---

<br>

## 🛠️ Scripts

```txt
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```

<br>

---

<br>

## API Expectations

Ensure you have a backend running that supports:

- POST /auth/login for JWT token

- GET /posts, GET /posts/:slug

- POST /posts with JSON body

- GET /categories

- GET/POST /comments?postSlug=...

<br>

---

<br>

## ✅ Best Practices Followed

- ✅ Type safety with TypeScript interfaces

- ✅ Modular + scalable folder layout

- ✅ Separation of logic (hooks/utils/components)

- ✅ LocalStorage helpers with error handling

- ✅ Debounced input support (via useDebounce)

- ✅ Custom axios instance with JWT header

<br>

---

<br>

## 🧪 Testing Checklist

- ☑️ Write post with image

- ☑️ Toggle theme

- ☑️ Navigate by category

- ☑️ Add comments to post

- ☑️ Login/logout via context

<br>

---

<br>
## 👤 Author

Built and maintained by Deolindo Baptista
MIT License.
Free for personal use.
Not allowed for commercial resale.

<br>

---

<br>

## 🧪 Want to contribute?

1. Fork the repo

2. Create a feature branch (feat/new-feature)

3. Open a pull request with a detailed description

<br>

---

<br>

## 🎉 Final Notes

This project is fully audit-verified, scalable, and ideal for personal blog platforms.

Happy coding! ✨

---
