# Ledger Application

This project contains a backend service and a frontend React application for a ledger system.

## Prerequisites
- Node.js
- MongoDB (running locally on port 27017 or update the `MONGO_URI` in `.env`)

## Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies (including the newly added `cors` package):
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
   *(Note: The server runs on http://localhost:3000)*

## Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *(Note: The frontend runs on http://localhost:5173)*

## Features
- **Authentication**: Register and Login for users.
- **Dashboard**: View accounts and check balances dynamically.
- **Transactions**: Transfer funds between accounts. *(Note: Transactions intentionally take 15 seconds to simulate a pending/processing state as defined in the backend).*
