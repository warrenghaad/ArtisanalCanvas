# Rest Express Art Academy

## Overview

This is a full-stack web application for an art instruction academy focused on Renaissance perspective drawing and geometric composition. The platform provides interactive drawing exercises, AI-powered assessment, and structured learning progression through a curriculum of perspective drawing techniques. Students can practice drawing fundamentals, submit their work for evaluation, and track their progress through various learning phases.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA** with TypeScript for type safety and modern development
- **Vite** as the build tool and development server for fast hot reloading
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management, caching, and API interactions
- **Tailwind CSS** with custom design system for consistent styling
- **Shadcn/ui components** providing accessible, customizable UI primitives
- **Canvas-based drawing interface** with custom drawing utilities for interactive art exercises

### Backend Architecture
- **Express.js** server with TypeScript for type-safe API development
- **RESTful API design** with structured error handling and request logging
- **In-memory storage implementation** using Map data structures for development/demo purposes
- **Modular route handling** with separate services for specialized functionality
- **Session-based progress tracking** with user state persistence

### Data Storage Solutions
- **Drizzle ORM** configured for PostgreSQL with type-safe database operations
- **Schema-first approach** with Zod validation for runtime type checking
- **Migration system** for database schema evolution
- **Memory storage adapter** for development with interface-based design for easy database swapping

### AI Integration
- **OpenAI GPT-5 integration** for intelligent drawing assessment and feedback
- **Image analysis capabilities** for evaluating student artwork submissions
- **Structured assessment results** with scoring, feedback, and improvement recommendations
- **AI-powered exercise tips** and personalized learning guidance

### Educational Framework
- **Structured curriculum system** with phases, exercises, and learning objectives
- **Progress tracking** with completion states, scores, and time spent
- **Interactive drawing exercises** with step-by-step guidance
- **Real-time practice sessions** with timer controls and session management

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless** - Neon PostgreSQL serverless driver
- **drizzle-orm** and **drizzle-kit** - Type-safe ORM and migration tools
- **express** - Web application framework
- **React ecosystem** (@tanstack/react-query, wouter, react-hook-form)

### UI and Styling
- **@radix-ui components** - Accessible UI primitives foundation
- **tailwindcss** - Utility-first CSS framework
- **class-variance-authority** - Component variant management
- **lucide-react** - Icon library

### AI and External Services
- **OpenAI API** - GPT-5 model for drawing assessment and educational feedback
- **Canvas API** - Browser native drawing capabilities for interactive exercises

### Development Tools
- **TypeScript** - Type safety across frontend and backend
- **Vite** - Fast build tool with HMR
- **ESBuild** - Fast JavaScript bundling for production
- **Replit plugins** - Development environment integration