````markdown
# 📝 Blog Posting Website

A full-stack **Blog Posting Website** built with **Next.js, Node.js, Express.js, MongoDB, and Google OAuth**.

## 🚀 Features

- 🔐 User Authentication (Google OAuth)
- 👨‍💼 Admin Login
- ✍️ Create, Edit & Delete Blogs
- 📖 Read Blogs
- ❤️ Like Blogs
- 💬 Comment System
- 🔍 Search Blogs
- 📱 Responsive Design
- ☁️ MongoDB Atlas Database
- 🔑 JWT Authentication

---

# 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Google OAuth

---

# 📦 Clone Repository

```bash
git clone https://github.com/ar0097/blog-posting-website.git
```

Move into the project directory:

```bash
cd blog-posting-website
```

---

# 📥 Install Dependencies

### Client

```bash
cd client
npm install
```

### Server

```bash
cd ../server
npm install
```

---

# ⚙️ Environment Variables

## Server

Create a file:

```
server/.env
```

Add the following variables:

```env
MONGO_URI=your_mongodb_cluster_url

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id

PORT=5000

ADMIN_PASSWORD=your_admin_password
```

---

## Client

Create a file:

```
client/.env.local
```

Add:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

---

# 🍃 MongoDB Setup

1. Create a MongoDB Atlas Cluster.
2. Create a Database User.
3. Whitelist your IP Address.
4. Copy the Connection String.
5. Replace:

```env
MONGO_URI=your_mongodb_cluster_url
```

---

# 🔑 Google OAuth Setup

1. Go to Google Cloud Console.
2. Create a Project.
3. Enable **Google Identity / OAuth**.
4. Create OAuth 2.0 Client ID.
5. Add Authorized JavaScript Origins:

For Local Development

```
http://localhost:3000
```

For Production

```
https://your-vercel-domain.vercel.app
```

6. Copy the Client ID.

Add it to:

**server/.env**

```env
GOOGLE_CLIENT_ID=your_google_client_id
```

**client/.env.local**

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

---

# ▶️ Run the Application

## Start Backend

```bash
cd server
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## Start Frontend

```bash
cd client
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# 📂 Project Structure

```
blog-posting-website
│
├── client/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── .env.local
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# 🚀 Deployment

## Frontend

Deploy the **client** folder on **Vercel**.

## Backend

Deploy the **server** folder on your preferred platform (e.g. Vercel, Render, Railway).

Don't forget to add all environment variables to your deployment platform before deploying.

---

# 👨‍💻 Author

**Arbaz Shah**

GitHub: https://github.com/ar0097

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
````
