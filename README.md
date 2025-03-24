# Expense Manager

A full-stack web application for managing personal expenses. Built with React, Node.js, Express, and MongoDB.

## Features

- Add, edit, and delete expenses
- Categorize expenses
- View expense statistics
- Responsive design
- Modern UI with Material-UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd expense-manager
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-manager
```

## Running the Application

1. Start MongoDB:
```bash
mongod
```

2. Start the backend server:
```bash
cd backend
npm run dev
```

3. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- GET /api/expenses - Get all expenses
- POST /api/expenses - Create a new expense
- GET /api/expenses/:id - Get a single expense
- PATCH /api/expenses/:id - Update an expense
- DELETE /api/expenses/:id - Delete an expense

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - React Router
  - Axios
  - date-fns

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - cors
  - dotenv 