# Book-Management

## Project Overview
This is a full-stack web application built using the following technologies:

### Frontend
- **React**: For building the user interface.
- **Vite**: For fast development and build tooling.
- **Tailwind CSS**: For styling the application.

### Backend
- **Node.js**: For building the server-side application.
- **Express.js**: For handling API routes.
- **MongoDB**: For the database.

## Features
- User authentication (register, login, logout).
- Add, edit, and delete books.
- Add and delete reviews for books.
- View user profile with books and reviews.
- Protected routes for authenticated users.

## Installation

### Prerequisites
- Node.js and npm installed on your system.
- MongoDB instance running.

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd Assignment2
   ```

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following:
   ```env
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRE=30d
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage
- Open the application in your browser at `http://localhost:3000`.
- Register or log in to access the features.

## Folder Structure
```
Assignment2/
├── backend/       # Backend code
├── frontend/      # Frontend code
└── README.md      # Project documentation
```

## License
This project is licensed under the MIT License.
