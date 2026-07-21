# IRFAN SOPANDI PERSONAL PORTFOLIO CMS

A modern full-stack personal portfolio website with CMS admin dashboard.

## Tech Stack

### Frontend
- React.js + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios

### Backend
- Node.js + Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Cloudinary (image storage)

## Project Structure

```
Portofolio/
├── frontend/          # React Vite frontend
├── backend/           # Node.js Express backend
└── README.md
```

## Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL database
- Cloudinary account

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

## Default Admin Credentials (after seeding)

- Email: `admin@irfansopandi.dev`
- Password: `Admin123!`

## Deployment

- **Frontend**: Vercel
- **Backend**: Railway / Render
- **Database**: Supabase PostgreSQL
- **Storage**: Cloudinary
