# Smart Citizen OminiStreetlight Backend

The **Smart Citizen OminiStreetlight Backend** is a RESTful API built with Node.js and Express.js to manage public infrastructure such as streetlights, roads, and other properties. It allows users to report issues, assign tasks, and manage properties efficiently.

---

## Features

- **User Management**:

  - Admins can create and delete user accounts (e.g., supervisors, engineers).
  - Role-based access control (Admin, Supervisor, Engineer).

- **Property Management**:

  - Create, update, and delete properties (e.g., streetlights, roads).
  - Track the status of properties (e.g., working, damaged, under repair).

- **Task Management**:

  - Assign tasks to engineers.
  - Update task statuses (e.g., pending, in progress, fixed).
  - Add comments to tasks.

- **Report Management**:

  - Submit reports for faulty properties with optional media uploads.
  - Fetch and delete reports.

- **Authentication**:
  - Secure login with JWT-based authentication.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/smart-citizen-backend.git
   cd smart-citizen-backend
   ```
2. Install dependencies:
   ```bash
    npm install
   ```
3. Set up environment variables: Create a .env file in the root directory and add the following: 
    ```bash
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    DEFAULT_ADMIN_EMAIL=admin@example.com
    DEFAULT_ADMIN_PASSWORD=admin123
    ```
4. Start the server:
   ```bash
   npm start
   ``` 

##   API Documentation

The API documentation is available via **Swagger UI**:

**URL:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

##  Authentication

- `POST /api/auth/login`  
  Authenticate a user and return a JWT token.

---

##  User Management (Admin only)

- `POST /api/users`  
  Create a new user account.

- `DELETE /api/users`  
  Delete a user account.

---

##  Property Management (Admin/Supervisor)

- `GET /api/properties`  
  Get all properties.

- `POST /api/properties`  
  Create a new property.

- `PATCH /api/properties/{propertyId}`  
  Update the status of a property.

- `DELETE /api/properties/{propertyId}` *(Admin only)*  
  Delete a property.

- `GET /api/properties/{id}`  
  Get a specific property by ID.

###  Property Model

- `propertyId`: `String` *(unique)*
- `type`: `String` *(e.g., apartment, office, etc.)*
- `location`: `String`
- `status`: `Enum` *(e.g., available, under_maintenance, faulty)*
- `createdAt`: `Date`
- `updatedAt`: `Date`

---

##  Task Management

- `POST /api/tasks/assign` *(Supervisor only)*  
  Assign a task to an engineer.

- `PATCH /api/tasks/{id}` *(Engineer only)*  
  Update the status of a task.

- `GET /api/tasks` *(Admin/Supervisor)*  
  Get all tasks.

- `GET /api/tasks/{id}/task` *(Admin/Supervisor)*  
  Get a specific task by ID.

- `POST /api/tasks/{id}/comment` *(Supervisor/Engineer)*  
  Add a comment to a task.

- `DELETE /api/tasks/{id}` *(Supervisor only)*  
  Delete a task.

---

##  Report Management

- `POST /api/report`  
  Submit a report for a faulty property.

- `GET /api/reports` *(Supervisor only)*  
  Get all reports.

- `GET /api/report/{reportId}` *(Supervisor only)*  
  Get a specific report by ID.

- `DELETE /api/report/{reportId}` *(Supervisor only)*  
  Delete a report.

---

##  User Model

- `fullName`: `String`
- `email`: `String` *(unique)*
- `phoneNumber`: `String`
- `role`: `Enum` *(admin, supervisor, engineer)*
- `passwordHash`: `String`
- `createdAt`: `Date`
