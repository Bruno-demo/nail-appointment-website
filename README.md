# Yves Nail Salon Appointment Website

Yves Nail Salon is a full-stack appointment booking platform for a nail salon. Customers can browse services, book appointments, register accounts, verify email addresses, and complete payments using the MTN MoMo sandbox flow. Admins can manage users, appointments, and salon services through a protected dashboard.

## Project Structure

- `frontend/` — React frontend for the salon website, booking flow, auth pages, and admin dashboard.
- `backend/` — Express API with MongoDB, authentication, services, appointments, payments, uploads, and email verification.

## Tech Stack

- React
- Express.js
- MongoDB and Mongoose
- JWT authentication
- Nodemailer
- MTN MoMo collection API integration

## Local Development

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
npm start
```

## Production Deployment

### Backend on Render

Use a Node web service with:

- Name: `yves-nail-backend`
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Region: `Oregon (US West)`

### Frontend on Vercel

Deploy the React frontend with:

```env
REACT_APP_API_BASE=https://nail-appointment-website-backend.onrender.com
```

## Required Backend Environment Variables

Set these in the Render service environment panel:

```env
PORT=5000
MONGO_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-jwt-secret>
EMAIL_USER=<your-gmail-or-smtp-user>
EMAIL_PASS=<your-gmail-or-smtp-app-password>
BASE_URL=https://nail-appointment-website-backend.onrender.com
FRONTEND_URL=https://nail-appointment-website.vercel.app
CORS_ORIGIN=https://nail-appointment-website.vercel.app
MTN_SUBSCRIPTION_KEY=<your-mtn-subscription-key>
MTN_BASE_URL=https://sandbox.momodeveloper.mtn.com
MTN_TARGET_ENV=sandbox
MTN_API_USER=<your-mtn-api-user>
MTN_API_KEY=<your-mtn-api-key>
MTN_CURRENCY=EUR
```

## Notes

- The backend route for public service listing is `GET /api/services`.
- The frontend API helper automatically appends `/api` to the configured base URL.
- Use the deployed Render URL for `BASE_URL` and the deployed Vercel URL for `FRONTEND_URL` and `CORS_ORIGIN`.
