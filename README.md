# Odin Blog Owner App

## Description

This is my implimentation of the Admin Frontend for the Blog API project from the NodeJS course of the Odin Project's Full-Stack JavaScript curriculum.

## **Overview**
This is the **Admin Dashboard** for the Odin Blog API project.  
It provides a private interface for managing:

- Blog posts (create, edit, publish, delete)  
- Comments (review, moderate, delete)  
- Draft workflows  
- Post metadata such as comment counts and publish timestamps  

This dashboard is intended for **administrators only** and is not exposed to public users.

The project is a **proof‑of‑concept**, designed to demonstrate a clean separation between:

- a public reader frontend  
- a private admin frontend  
- a standalone backend API  
- a managed Postgres database  

---

## **Tech Stack**
- **React + Vite**  
- **TypeScript**  
- **React Router**
- **Native `fetch` API**
- **Zustand** (client-side state)
- **CSS Modules** for scoped styling 
- **Vite environment variables** for API configuration
- **JWT‑based authentication** (stored in memory or localStorage depending on your setup)

---

## **Environment Variables**
The admin app communicates with the backend API through a single environment variable:

```
VITE_API_URL=https://your-backend-url.com
```

During local development:

```
VITE_API_URL=http://localhost:3000
```

Make sure this is set before running or building the project.

---

## **Running Locally**

### **Install dependencies**
```
npm install
```

### **Start the dev server**
```
npm run dev
```

The app will start on a Vite‑assigned port (usually `5173`).

### **Login**
Use your seeded admin credentials:

```
email: admin@example.com
password: admin123
```

(Or whatever you configured in your Prisma seed script.)

---

## **Build for Production**
```
npm run build
```

The output will be placed in:

```
dist/
```

This folder can be deployed to any static hosting provider.

---

## **Deployment**
This project is designed to deploy cleanly to free static hosts such as:

- **Netlify**  
- **Vercel**  
- **GitHub Pages** (if you configure routing)  

### **Required environment variable in production**
Set:

```
VITE_API_URL=https://your-backend.onrender.com
```

(or whatever your backend URL is)

Netlify/Vercel will inject this at build time.

---

## **Features**
- Admin‑only authentication  
- Post list with comment counts  
- Draft vs published sorting  
- Create/edit post form with markdown preview
- Publish/unpublish controls  
- Comment moderation  
- Pagination

---

## **Project Status**
This is a **proof‑of‑concept** implementation.  
It demonstrates:

- a clean admin workflow  
- a decoupled frontend/backend architecture  
- a production‑ready deployment pipeline  
- a real Postgres database

Future improvements could include:

- role‑based access control  
- rich‑text editing  
- image uploads  
- analytics dashboard  
- multi‑author support

---

## **License**
MIT (or your preferred license)