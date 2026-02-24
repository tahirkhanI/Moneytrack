# Student Finance Tracker

A full-stack student finance tracker built with **React + Vite + Tailwind** on the frontend and **Node.js + Express + MongoDB** on the backend.

## Features
- JWT authentication with bcrypt password hashing.
- Income and expense CRUD with filters and search.
- Dashboard analytics (income, expenses, net balance, trends, category pie chart).
- Monthly budget progress with warning states at 75% and 100%.
- Savings goals with contribution tracking.
- CSV export for transactions and PDF report export.
- Protected routes, validation middleware, secure API defaults.

## Project Structure
- `frontend/` React app with charts and responsive UI.
- `backend/` Express API with Mongoose models and modular controllers/routes.

## Local Setup
### 1) Prerequisites
- Node.js 18+
- MongoDB running locally (or cloud MongoDB URI)

### 2) Backend
```bash
cd backend
cp ../.env.example .env
npm install
npm run dev
```

### 3) Frontend
```bash
cd frontend
cp ../.env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.

## Seed Demo Data
```bash
cd backend
npm run seed
```
Demo credentials:
- Email: `student@example.com`
- Password: `password123`

## API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `GET/POST /api/transactions`
- `PUT/DELETE /api/transactions/:id`
- `GET /api/transactions/export/csv`
- `GET /api/transactions/export/pdf`
- `GET/POST /api/savings-goals`
- `POST /api/savings-goals/:id/contribute`
- `DELETE /api/savings-goals/:id`
- `GET /api/analytics/dashboard`

## Future Improvements
- Role-based access control and admin analytics.
- AI-based smart expense categorization.
- PWA support with offline caching and push reminders.
- Multi-currency support and recurring transaction automation.
- E2E and unit test coverage with CI/CD pipeline.
