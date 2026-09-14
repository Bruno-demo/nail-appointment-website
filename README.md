# Yves Nail Salon Appointment Website

Yves Nail Salon is a full-stack web application for booking nail salon appointments online. It includes customer registration, email verification, service browsing, appointment booking, protected admin workflows, and MTN MoMo payment integration.

## Project Structure

- `frontend/` — React app for the public website and admin dashboard
- `backend/` — Express.js API with MongoDB, authentication, services, appointments, payments, and email handling

## Tech Stack

- React
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Nodemailer
- MTN MoMo sandbox collection API

## Local Development

Frontend:

```bash
cd frontend
npm install
npm start
```

Backend:

```bash
cd backend
npm install
npm start
```

## Production Deployment

The backend should be deployed on Render with:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

The frontend should be deployed on Vercel with:

- `REACT_APP_API_BASE=https://nail-appointment-website-backend.onrender.com`

## Environment Variables

The backend requires variables such as:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `BASE_URL`
- `FRONTEND_URL`
- `CORS_ORIGIN`
- `MTN_SUBSCRIPTION_KEY`
- `MTN_BASE_URL`
- `MTN_TARGET_ENV`
- `MTN_API_USER`
- `MTN_API_KEY`
- `MTN_CURRENCY`
