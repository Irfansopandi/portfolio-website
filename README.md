# 🚀 Irfan Sopandi — Personal Portfolio CMS

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?logo=node.js" />
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql" />
  <img src="https://img.shields.io/badge/Prisma-ORM-black?logo=prisma" />
</p>


<p align="center">
  Full-stack personal portfolio website with a custom CMS dashboard for managing portfolio content dynamically.
</p>


---

## ✨ Overview

**Irfan Sopandi Personal Portfolio CMS** is a modern full-stack portfolio platform built to showcase personal branding, projects, skills, experiences, and achievements.

Unlike a static portfolio website, this project comes with a custom **Admin CMS Dashboard** that allows content management without modifying the source code.

The system provides complete control over portfolio data, including profile information, projects, skills, certificates, education, experience, and incoming messages.


---

# 🎯 Main Features

## 🌐 Public Portfolio

- Modern responsive portfolio website
- Personal profile presentation
- About section
- Project showcase
- Skills display
- Education timeline
- Certificate showcase
- Experience section
- Contact form
- Multi-language support (ID / EN)
- Responsive design


## ⚡ CMS Admin Dashboard

A custom dashboard for managing website content:

✅ Profile Management  
✅ Project Management  
✅ Skills Management  
✅ Education Management  
✅ Certificate Management  
✅ Experience Management  
✅ Contact Message Inbox  
✅ Dynamic Content Update  


## 💬 Message Management

Complete contact management system:

- Receive visitor messages
- Store messages securely
- Admin inbox
- Read/unread status
- Notification badge counter
- Message tracking


## 🔔 Notification System

Integrated notification system:

- Admin dashboard notification badge
- Unread message counter
- Telegram bot notification
- Instant alert when receiving new messages


---

# 🏗️ Architecture


```
                 Visitor

                    |
                    |

          React Portfolio Website

                    |

                    |

             Node.js REST API

                    |

        -------------------------

        |                       |

   PostgreSQL              Cloudinary

        |

        |

    Admin CMS Dashboard

```


---

# 🛠️ Tech Stack


## Frontend

| Technology | Usage |
|---|---|
| React.js | User Interface |
| Vite | Build Tool |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Framer Motion | Animation |
| React Router | Navigation |
| Axios | API Communication |


## Backend

| Technology | Usage |
|---|---|
| Node.js | Runtime |
| Express.js | API Server |
| Prisma ORM | Database Management |
| PostgreSQL | Database |
| JWT | Authentication |
| Cloudinary | Image Storage |


## Integration

- Telegram Bot API
- Supabase PostgreSQL
- Vercel
- Railway / Render


---

# 📂 Project Structure

```
portfolio-website/

├── frontend/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── prisma/
│   ├── src/
│   └── package.json
│
└── README.md

```


---

# ⚙️ Installation


## Clone Repository

```bash
git clone https://github.com/Irfansopandi/portfolio-website.git

cd portfolio-website
```


---

# Backend Setup


```bash
cd backend

npm install
```

Create `.env`:

```env
DATABASE_URL=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```


Run migration:

```bash
npx prisma migrate dev
```


Start server:

```bash
npm run dev
```


---

# Frontend Setup


```bash
cd frontend

npm install

npm run dev
```


---

# 🚀 Deployment


| Service | Platform |
|-|-|
| Frontend | Vercel |
| Backend | Railway / Render |
| Database | Supabase PostgreSQL |
| Storage | Cloudinary |


---

# 📸 Preview

_Add your screenshots here_

```
/screenshots
```

Example:

- Homepage
- Admin Dashboard
- Message Inbox
- Project Management


---

# 🔮 Future Development

- Real-time notification using Socket.io
- Email notification
- Visitor analytics dashboard
- Role permission system
- Advanced CMS customization


---

# 👨‍💻 Developer


## Irfan Sopandi

Full-stack Developer focused on building modern web applications and digital solutions.


<p align="center">
  Made with ❤️ using React & Node.js
</p>