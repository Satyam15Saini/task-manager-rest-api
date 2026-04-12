# 📝 Task Management REST API

🟢 **Node.js** | ⚙️ **Express.js** | 🐘 **PostgreSQL** | 🍃 **MongoDB** | 🐳 **Docker**

A highly secure, data-driven RESTful API for managing tasks. This project demonstrates a dual-database architecture, utilizing **PostgreSQL** for strict relational user data and **MongoDB** for flexible task document storage.


🎥 **[Watch the Demo Video Here]** *(https://drive.google.com/file/d/1LRWML294EE7r0AT3yIZmMUtSAiytwQ07/view?usp=sharing)*

---

## 🚀 Features & Security

- **Dual-Database Architecture:** PostgreSQL (via Sequelize ORM) handles ACID-compliant user accounts, while MongoDB (via Mongoose ODM) manages tasks for schema flexibility.
- **Robust Authentication:** Secure user registration and login using encrypted passwords (`bcryptjs`) and stateless sessions via **JSON Web Tokens (JWT)**.
- **Strict Access Control:** Database queries explicitly bind to the authenticated `userId`. A user is mathematically restricted from accessing, modifying, or deleting tasks belonging to another user.
- **Data Validation:** Global middleware using `Joi` intercepts and validates incoming payloads (e.g., email formatting, required fields) before they ever reach the database controllers.
- **Centralized Error Handling:** A unified error-handling pipeline ensures clients receive consistent, clean HTTP responses (400, 401, 403, 404, 500) without exposing sensitive stack traces.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16+)
- Docker and Docker Compose (highly recommended for local database setup)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Satyam15Saini/task-manager-rest-api.git](https://github.com/Satyam15Saini/task-manager-rest-api.git)
   cd task-manager-rest-api

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

## 📖 API Documentation

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



## 🧠 Design Decisions

1. **Dual-Database Architecture**: PostgreSQL was chosen for User Accounts to ensure strict relational integrity and ACID compliance for sensitive authentication data. MongoDB was chosen for Tasks to allow for flexible schema evolution (e.g., easily adding tags, comments, or dynamic statuses to tasks in the future without rigorous structural migrations).

2. **Stateless Authentication (JWT)**: JSON Web Tokens ensure the API horizontally scales without relying on server-side session memory.

3. **Validation Layer Separation**: `express-validator` logic is decoupled into a dedicated `validators` directory and mounted sequentially in the Route chains. This prevents the controllers from becoming bloated with input-checking logic, preserving the Single Responsibility Principle.

4. **Access Control**: Database queries explicitly require the `userId` attached to the authenticated JWT. This mathematically guarantees that a user cannot manipulate a task they do not own at the query execution level, avoiding the risk of application-layer logic bugs.

---


## 🗄️ Database Schemas

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
