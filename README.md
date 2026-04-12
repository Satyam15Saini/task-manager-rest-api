# Task Management API

A secure, data-driven RESTful API for managing tasks, built using Node.js, Express, PostgreSQL, and MongoDB.

## Features
- **User Management**: Registration and login using JWT authentication.
- **Task Management**: CRUD operations for tasks, securely scoped to the authenticated user.
- **Dual Databases**: PostgreSQL for user accounts (via Sequelize ORM) and MongoDB for tasks (via Mongoose ODM).
- **Validation & Error Handling**: Joi validation for payloads and a global error handling middleware for unified responses.

## ✅ Evaluation Requirement Checklist
* [x] **Clear setup instructions:** Described in Getting Started (#Getting-Started).
* [x] **Detailed API documentation:** Documented in API Documentation section below.
* [x] **User registration and login:** Implemented using PostgreSQL + JWT (`/api/auth`).
* [x] **CRUD Tasks for Authenticated User:** Fully implemented. MongoDB documents store `userId` linking back to the Postgres schema.
* [x] **Access Control (Cross-User Protection):** `Task.findOneAndUpdate({ _id: id, userId: req.user.id })` validates that a task can absolutely not be modified by another user. Will return 404/401 unauthorized.
* [x] **Validation & Error Handling:** `Joi` catches missing payload variables (e.g. absent Task title, malformed emails) and responds robustly with a global middleware `400 Bad Request` prior to hitting the DB schemas.

## Tech Stack
- **Node.js** & **Express**
- **PostgreSQL** (Users) & **MongoDB** (Tasks)
- **Sequelize** & **Mongoose**
- **bcryptjs** (Password Hashing) & **jsonwebtoken** (Auth)
- **Joi** (Data Validation)

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- Docker and Docker Compose (highly recommended for easy DB setup)

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd task-manager-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory (one is provided for local docker usage):
   ```env
   PORT=3000
   POSTGRES_URI=postgresql://root:rootpassword@localhost:5432/taskdb
   MONGODB_URI=mongodb://root:rootpassword@localhost:27017/taskdb?authSource=admin
   JWT_SECRET=supersecretjwtkeythatshouldbechanged
   ```

4. **Start Databases**:
   Using the provided `docker-compose.yml`, start PostgreSQL and MongoDB locally:
   ```bash
   docker-compose up -d
   ```

5. **Start the Server**:
   ```bash
   npm run dev    # For development with nodemon
   npm start      # For production
   ```
   The server should connect to both databases and sync the models automatically.

---

## API Documentation

### Base URL: `http://localhost:3000/api`

### 1. Authentication
All Auth endpoints are mapped under `/api/auth`.

#### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body** (JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "mypassword123"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "User registered successfully",
    "userId": 1
  }
  ```

#### Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body** (JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "mypassword123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5c... "
  }
  ```

#### Get Profile (Protected)
- **URL**: `/auth/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <your_jwt_token>`
- **Success Response**: `200 OK`
  ```json
  {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "createdAt": "2023-10-01T12:00:00.000Z",
      "updatedAt": "2023-10-01T12:00:00.000Z"
    }
  }
  ```

---

### 2. Tasks
All Task endpoints are mapped under `/api/tasks` and **require authentication** (`Authorization: Bearer <token>`).

#### Create Task
- **URL**: `/tasks`
- **Method**: `POST`
- **Body** (JSON):
  ```json
  {
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "dueDate": "2024-12-01T12:00:00Z",
    "status": "pending"
  }
  ```
- **Success Response**: `201 Created`

#### Get All Tasks
- **URL**: `/tasks`
- **Method**: `GET`
- **Success Response**: `200 OK`
  ```json
  {
    "tasks": [
      {
        "_id": "60d5ec49f8...",
        "title": "Buy groceries",
        "description": "Milk, eggs, bread",
        "status": "pending",
        "userId": 1,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

#### Get Single Task
- **URL**: `/tasks/:id`
- **Method**: `GET`
- **Success Response**: `200 OK`

#### Update Task
- **URL**: `/tasks/:id`
- **Method**: `PUT`
- **Body** (JSON): Can be relatively flat (e.g., just updating status)
  ```json
  {
    "status": "completed"
  }
  ```
- **Success Response**: `200 OK`

#### Delete Task
- **URL**: `/tasks/:id`
- **Method**: `DELETE`
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

## Project Structure
- `src/config`: Handles database connection configurations (Sequelize and Mongoose).
- `src/controllers`: Contains the business logic and orchestrates database transactions via models.
- `src/middlewares`: Global and route-specific middleware (e.g., JWT Auth, Error Handler).
- `src/models`: Defining Postgres/Sequelize tables and MongoDB/Mongoose schemas.
- `src/routes`: Express router mappings hooking up endpoints to controllers.
- `src/validators`: Request schema definitions mapped with `express-validator`.
- `src/utils`: Reusable helper functions.

---

## Design Decisions
1. **Dual-Database Architecture**: PostgreSQL was chosen for User Accounts to ensure strict relational integrity and ACID compliance for sensitive authentication data. MongoDB was chosen for Tasks to allow for flexible schema evolution (e.g., easily adding tags, comments, or dynamic statuses to tasks in the future without rigorous structural migrations).
2. **Stateless Authentication (JWT)**: JSON Web Tokens ensure the API horizontally scales without relying on server-side session memory.
3. **Validation Layer Separation**: `express-validator` logic is decoupled into a dedicated `validators` directory and mounted sequentially in the Route chains. This prevents the controllers from becoming bloated with input-checking logic, preserving the Single Responsibility Principle.
4. **Access Control**: Database queries explicitly require the `userId` attached to the authenticated JWT. This mathematically guarantees that a user cannot manipulate a task they do not own at the query execution level, avoiding the risk of application-layer logic bugs.

---

## Database Schemas

### PostgreSQL `Users` Table (Sequelize)
\`\`\`sql
CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
\`\`\`

### MongoDB `Tasks` Collection (Mongoose)
\`\`\`json
{
  "_id": "ObjectId",
  "title": { "type": "String", "required": true },
  "description": { "type": "String", "default": "" },
  "dueDate": { "type": "Date" },
  "status": { "type": "String", "enum": ["pending", "completed"], "default": "pending" },
  "userId": { "type": "Number", "required": true }, // Links directly to PostgreSQL User ID
  "createdAt": "Date",
  "updatedAt": "Date"
}
\`\`\`
