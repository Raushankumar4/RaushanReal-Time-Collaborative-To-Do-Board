# 🗂️ Real-Time Collaborative Kanban Board – MERN Stack

A full-stack task management application that enables users to create, assign, update, and track tasks in real-time using WebSockets. Built with the **MERN stack**, following clean architecture and assignment specifications.

---

## 🔗 Live Links

- 🌐 **Frontend (Vercel)**: [https://your-kanban-frontend.vercel.app](https://your-kanban-frontend.vercel.app)
- 🖠️ **Backend API (Render)**: [https://your-kanban-backend.onrender.com](https://your-kanban-backend.onrender.com)
- ☁️ **Database**: MongoDB Atlas (Cloud)
- 🗁 **Repository**: GitHub - MERN Kanban Project

---

## ⚙️ Tech Stack

- **Frontend**: React 18+ with Vite, TanStack Query, Socket.IO client
- **Backend**: Node.js, Express, Socket.IO, Mongoose
- **Database**: MongoDB Atlas
- **Auth**: JWT in HTTP-only cookie
- **Real-Time**: WebSockets (Socket.IO)
- **Deployment**: Vercel (Frontend) + Render (Backend)

---

## 📚 Features (As Per Assignment)

| Feature                        | Description                                          |
| ------------------------------ | ---------------------------------------------------- |
| 🔐 Authentication              | JWT-based, with protected routes and session cookies |
| 🧑‍💼 Role-based Access           | Only task creators can update/delete their tasks     |
| 📋 CRUD Tasks                  | Create, read, update (inline), and delete tasks      |
| 🔄 Smart Assign                | Assigns task to user with fewest active tasks        |
| 🧠 Activity Log Panel          | Shows last 20 task actions in real-time              |
| 📦 Drag-and-Drop               | Move tasks between columns with real-time sync       |
| 🧠 Real-Time Updates           | All task and log changes sync via Socket.IO          |
| 🩼 Logout                       | Clears cookie and redirects to login                 |
| 🚫 Unassigned by Default       | Tasks start unassigned, can be smart-assigned        |
| 🔐 Protected Routes            | Frontend guarded by auth checks                      |
| 🌐 No CSS Libraries (per spec) | Fully custom styling, no Tailwind/Bootstrap used     |

---

## 🚀 Getting Started Locally

### 1. Clone & Install

```bash
git clone https://github.com/Raushankumar4/Real-Time-Collaborative-To-Do-Board
cd Real-Time-Collaborative-To-Do-Board
```

### 2. Setup `.env`

Create two `.env` files:

#### `server/.env`

```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

#### `client/.env`

```env
VITE_API=http://localhost:5000
```

### 3. Run Locally

**Backend**

```bash
cd server
npm install
npm run dev
```

**Frontend**

```bash
cd client
npm install
npm run dev
```

---

## 🧪 Test Cases

- [x] Only creator can delete
- [x] Real-time sync between multiple tabs
- [x] Smart assign works correctly
- [x] Task moves update across clients
- [x] Logout clears cookie + redirects

---

## ✅ Deployment

| Layer    | Platform      | URL                                                                                  |
| -------- | ------------- | ------------------------------------------------------------------------------------ |
| Frontend | Vercel        | [https://your-kanban-frontend.vercel.app](https://your-kanban-frontend.vercel.app)   |
| Backend  | Render        | [https://your-kanban-backend.onrender.com](https://your-kanban-backend.onrender.com) |
| Database | MongoDB Atlas | —                                                                                    |

---

## 🙌 Acknowledgements

This project was developed as part of the **MERN Stack Kanban Board Assignment**, demonstrating mastery of:

- JWT Auth
- Socket.IO
- MongoDB relationships
- Protected APIs
- React Query
- Real-time architecture

---

## 📬 Contact

**Developer**: Raushan Kumar
**Email**: [raushankumarguptag@gmail.com](mailto:raushankumarguptag@gmail.com)
