# Course Management Platform

## Overview

This is a full-stack course management platform built with React, Express, and TypeScript. The application allows users to browse courses, view course details, and upload HTML content for courses. It features a modern UI built with shadcn/ui components and uses Drizzle ORM for database operations with PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with JSON responses
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **File Upload**: Multer middleware for HTML file uploads (10MB limit)
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **Error Handling**: Centralized error handling middleware

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Tables**: Users and courses with UUID primary keys
- **File Storage**: HTML content stored as text in database

### Key Features
- **Course Browsing**: Grid layout with course cards showing thumbnails, ratings, and metadata
- **Course Details**: Individual course pages with detailed information
- **File Upload**: HTML file upload functionality for course content
- **Responsive Design**: Mobile-first responsive layout
- **Toast Notifications**: User feedback for actions and errors

### Component Structure
- **Reusable Components**: Course cards, navigation bar, upload section
- **UI Components**: Complete shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation
- **Mobile Support**: Mobile-responsive navigation and layouts

## External Dependencies

### Core Framework Dependencies
- **React**: Frontend framework with hooks and modern patterns
- **Express**: Node.js web framework for API server
- **TypeScript**: Type safety across frontend and backend

### Database & ORM
- **Drizzle ORM**: Type-safe database operations and migrations
- **@neondatabase/serverless**: PostgreSQL driver for Neon database
- **drizzle-zod**: Schema validation integration

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Development Tools
- **Vite**: Fast build tool and development server
- **TSX**: TypeScript execution for development
- **ESBuild**: Fast JavaScript bundler for production

### Utilities
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling and validation
- **Zod**: Runtime type validation
- **Wouter**: Lightweight client-side routing
- **date-fns**: Date manipulation utilities
- **Multer**: File upload middleware