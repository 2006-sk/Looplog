# 🧾 LoopLog – Logging & Analytics Platform

LoopLog is a full-stack logging and productivity tracker built for backend-focused development. It allows users to log daily activities across meaningful categories like Work, Learning, and Mental Health — with features to group entries by date or category. The app is built using Express.js, React, and MongoDB.

---

## 🔗 Live Demo

- 🌐 Frontend (Vercel): https://looplog-2006sks-projects.vercel.app/ 
- ⚙️ Backend API (Render): https://looplog-1.onrender.com/api/logs

---

## 🎯 Features

- ✅ Add, edit, and delete log entries
- ✅ Color-coded categories (Work, Mental Health, Social, etc.)
- ✅ Group logs by **date** or **category**
- ✅ Clean, minimalist UI (backend-friendly layout)
- ✅ Fully functional REST API tested with Postman

---

## 🛠 Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Frontend    | React (Vite)              |
| Backend     | Node.js, Express.js, MongoDB, Mongoose |
| Deployment  | Vercel (frontend) + Render (backend) |

---

## 🚀 Running Locally

### 1. Clone the repo
```bash
git clone https://github.com/your-username/Looplog.git
cd Looplog
```

### 2. Setup Backend
```bash
cd server
npm install
touch .env
```

**Add your MongoDB URI to `.env`:**
```
MONGO_URI=your_mongodb_connection_uri
```

Then run it:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../client
npm install
touch .env
```

**Add your backend URL to `.env`:**
```
VITE_API_URL=http://localhost:5001/api/logs
```

Then run:
```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 📁 Folder Structure

```
Looplog/
├── client/           # React frontend (Vite)
│   └── src/App.jsx   # Logging dashboard
├── server/           # Express backend
│   └── routes/temp.js
│   └── models/Log.js
├── README.md
```

---

## 🔗 API Endpoints

All backend routes are prefixed with `/api/logs`

| Method | Endpoint        | Description        |
|--------|------------------|--------------------|
| GET    | `/api/logs`      | Get all logs       |
| POST   | `/api/logs`      | Create a log       |
| PUT    | `/api/logs/:id`  | Update a log       |
| DELETE | `/api/logs/:id`  | Delete a log       |

✅ All endpoints successfully tested using Postman.

---

## 🧑‍💻 Author

Shresthkumar Karnani
Backend developer
GitHub: https://github.com/2006-sk

---

## 🏁 License

MIT
