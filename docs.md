# API Documentation

## Table of Contents
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the application](#running-the-application)
- [API Documentation](#api-documentation)
    - [Entities](#entities)
    - [Controllers](#controllers)
    - [Services](#services)
    - [DTOs](#dtos)
    - [Guards](#guards)
    - [Filters](#filters)
    - [Utilities](#utilities)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Tasks](#tasks)
- [Real-time Communication](#real-time-communication)
  - [Socket Events (Server to Client)](#socket-events-server-to-client)
  - [Socket Endpoints (Client to Server)](#socket-endpoints-client-to-server)

## Getting Started
### Installation
1. Clone the repository
```bash
git clone https://github.com/Babatunde13/task-stream-api.git
```

2. Change directory to the project folder
```bash
cd task-stream-api
```

3. Install dependencies

For the project, I used `yarn` as the package manager, you can install it by running the following command if you don't have it installed already

```bash
npm install -g yarn
```

Then install the dependencies by running the following command
```bash
yarn install
```

4. Create a `.env` file in the root directory and add the following environment variables, 
The `DB_URI` should be a MongoDB URI, you can use a local MongoDB instance or a cloud MongoDB service like MongoDB Atlas, by default it is `mongodb://localhost:27017/task-stream`. The JWT_SECRET can be any random but strong string which will be used to sign the JWT token.

```bash
PORT=3000
DB_URI=mongodb://localhost:27017/task-stream
JWT_SECRET=your_secret_key
```

### Running the application
To start the application in dev mode, run the following command

```bash
yarn run start:dev
```

To start the application in production mode, run the following command

```bash
yarn run build && yarn run start:prod
```

## API Documentation
### Entities
- `User` -> Store user information
    - `_id` (ObjectId)
    - `fullname` (String)
    - `email` (String)
    - `password` (String)
    - `createdAt` (Date)
    - `updatedAt` (Date)
- `Task` -> Store task information
    - `_id` (ObjectId)
    - `title` (String)
    - `description` (String)
    - `status` (Enum) # ['open', 'in_progress', 'done'] (default: 'open')
    - `owner` (ObjectId)
    - `priority` (String)
    - `dueDate` (Date)
    - `createdAt` (Date)
    - `updatedAt` (Date)

### `Controllers`
- `AuthController`
    - `login` -> uses LoginDto
    - `register` -> uses RegisterDto
- `TaskController`
    - `createTask` -> uses CreateTaskDto
    - `getTasks` -> uses GetTasksDto
    - `getTask` -> uses GetTaskDto
    - `updateTask` -> uses UpdateTaskDto
    - `updateTaskStatus` -> uses UpdateTaskStatusDto
    - `deleteTask` -> uses GetTaskDto
    - `getAuthUserTasks` -> uses GetTasksDto
    - `getUserTask` -> uses GetTaskDto

### Services
- `AuthService`
    - `login`: Gets user by email and compares password and generates token
    - `register` -> creates a new user and generates token
- `TaskService`
    - `createTask` -> creates a new task for the authenticated user
    - `getTasks` -> gets all tasks filtered by status and dueDate(tasks whose dueDate is greater than or equal to the given dueDate) and sorts by priority, dueDate and createdAt
    - `getTask` -> gets a task by id
    - `updateTask` -> updates a task by id for the authenticated user
    - `updateTaskStatus` -> updates a task status by id for the authenticated user
    - `deleteTask` -> deletes a task by id for the authenticated user
    - `getAuthUserTasks` -> gets all tasks of the authenticated user filtered by status and dueDate(tasks whose dueDate is greater than or equal to the given dueDate) and sorts by priority, dueDate and createdAt
    - `getUserTasks` -> gets all tasks of the given user filtered by status and dueDate(tasks whose dueDate is greater than or equal to the given dueDate) and sorts by priority, dueDate and createdAt

### DTOs
- Auth Dtos
    - `LoginDto`
        - `email` (String)
        - `password` (String) # should be at least 8 characters with at least one uppercase letter, one lowercase letter, one number and one special character
    - `RegisterDto`
        - `fullname` (String)
        - `email` (String)
        - `password` (String) # should be at least 8 characters with at least one uppercase letter, one lowercase letter, one number and one special character
- Task Dtos
    - `CreateTaskDto`
        - `title` (String)
        - `description` (String)
        - `priority` (String)
        - `dueDate` (DateString)
    - `UpdateTaskDto`
        - `title` (String)
        - `description` (String)
        - `priority` (String)
        - `dueDate` (DateString)
    - `UpdateTaskStatusDto`
        - `status` (Enum) # ['open', 'in_progress', 'done']
    - `Get Tasks Dto`
        - `status` (Enum) # ['open', 'in_progress', 'done']
        - `dueDate` (DateString)

### Guards
- `AuthGuard` -> checks if the user is authenticated. It uses JWT token to authenticate the user, returns a 401 error if the user is not authenticated

### Filters
- `HttpExceptionFilter` -> Catches all exceptions and returns a formatted response with status code and message

### Utilities
- `utils.ts`: Handles utility functions such as hashing and token generation

## API Endpoints
The API Documentation is available at BaseURL/api/v1/docs i.e [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)
### Authentication
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`

### Tasks
- `GET /api/v1/tasks/user` - Get all tasks of the authenticated user
- `GET /api/v1/tasks/user/{id}` - Get all tasks of the given user
- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks` - Get all tasks
- `GET /api/v1/tasks/{id}` - Get a task by id
- `PUT /api/v1/tasks/{id}` - Update a task by id
- `PATCH /api/v1/tasks/{id}/status` - Update a task status by id
- `DELETE /api/v1/tasks/{id}` - Delete a task by id

## Real-time Communication
### Socket Events (Server to Client)
- `task-created` - Emitted when a new task is created
- `task-updated` - Emitted when a task is updated
- `task-deleted` - Emitted when a task is deleted

### Socket Endpoints (Client to Server)
- `create-task` - Create a new task
- `update-task` - Update a task
- `delete-task` - Delete a task

