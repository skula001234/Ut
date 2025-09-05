
# Course Management Platform

A full-stack course management platform built with React, Express, and TypeScript.

## 🚀 Features

- **Course Browsing**: Grid layout with course cards
- **Video Player**: HLS and MP4 support 
- **Responsive Design**: Mobile-first approach
- **Modern UI**: shadcn/ui + Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **File System**: Course content management

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL (Neon)
- **UI**: shadcn/ui, Tailwind CSS
- **Deployment**: Netlify + Neon

## 📦 Installation

```bash
git clone <repository-url>
cd course-platform
npm install
```

## 🔧 Environment Setup

```bash
cp .env.example .env
# Add your Neon DATABASE_URL
```

## 🚀 Development

```bash
npm run dev
```

## 📊 Database Setup

```bash
npm run db:push
```

## 🌐 Deployment

### Netlify Deployment:

1. Connect GitHub repository to Netlify
2. Set build command: `npm run build:netlify`
3. Set publish directory: `dist/public`
4. Add environment variables:
   - `DATABASE_URL`: Your Neon database URL
   - `NODE_ENV`: `production`

### Environment Variables:
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode

## 📁 Project Structure

```
├── client/          # React frontend
├── server/          # Express backend  
├── shared/          # Shared schemas
├── courses/         # Course content files
├── netlify/         # Netlify functions
└── dist/           # Build output
```

## 🎯 API Endpoints

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `GET /api/courses/info` - Get course metadata

Built with ❤️ using Replit
