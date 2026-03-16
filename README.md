# Policy-Based Authorization API

A Node.js REST API demonstrating Policy-Based Access Control (PBAC) implementation using Express, Sequelize ORM and PostgreSQL. This project was built as a learning exercise to understand how to implement policy-driven authorization beyond simple role-based access.

## What is Policy-Based Authorization?

Unlike traditional Role-Based Access Control (RBAC) where roles directly determine permissions, Policy-Based Authorization separates permissions (policies) from roles. Roles are assigned to users, policies define specific permissions/actions and roles are linked to policies through a many-to-many relationship.

## Benefits:
- **Granular control**: Define specific actions (create_user, delete_policy, update_user_role) as policies.
- **Flexibility**: Assign multiple policies to roles without creating new roles.
- **Scalability**: Add new permissions without restructuring your role hierarchy.
- **Auditability**: Track exactly which permissions each role possesses.


## Features
### User Management
- User registration with auto-assigned default role.
- Secure login with JWT tokens (HTTP-only cookies).
- Password hashing with bcrypt.
- User profile with role details.
- Update user roles.
- Delete users.

### Role Management
- Create roles with descriptions.
- Edit role details.
- List all roles.
- Delete roles.


### Policy Management
- Create policies (permissions).
- Edit policy details.
- Assign policies to roles.

### Authorization Middleware
- JWT authentication (authenticate).
- Policy-based authorization (authorize('policy_name')).

## Tech Stack
## Tech Stack

| Layer             | Technology        |
|------------------|-----------------|
| Runtime           | Node.js          |
| Framework         | Express.js       |
| Database ORM      | Sequelize        |
| Authentication    | JWT (jsonwebtoken) |
| Password Hashing  | bcrypt           |
| Environment Config| dotenv           |

## Getting Started
### Prerequisites
- Node.js 
- PostgreSQL or MySQL database
- npm or yarn

### Installation
1. **Clone the repository**
```bash
git clone https://github.com/Caleb-ne1/policy_auth_api.git
cd policy_auth_api
```

2. **Install dependencies**
```bash
npm install
```
3. **Environment Setup**

Create a .env file in the root:
```bash
# Server
PORT=5000


# cors config
# Multiple origins must be separated by commas
CORS_ORIGINS=http://localhost:3000,https://example.com

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=policy_auth_db
DB_USER=your_username
DB_PASSWORD=your_password
DB_DIALECT=postgres  # or 'mysql', 'sqlite', 'mssql'

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1h

# Default Role
DEFAULT_USER_ROLE=user
```
4. **Database Setup**
Ensure your database exists, then run:
```bash
node index.js
```

Sequelize will sync models automatically 

## Running with Docker

- Before running the containers update database .env with the following database configuration (used by Docker Compose):

```env 
# Database (for Docker Compose)
DB_HOST=db          # must match the 'db' service in docker-compose.yml
DB_PORT=5432
DB_NAME=policy_auth_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_DIALECT=postgres
```

- Then build and start the containers:

```bash
docker compose up --build
```
- Stop containers:

```bash
docker compose down
```
- Your API will be available at:

http://localhost:5000

## API Endpoints
### Authentication

| Method | Endpoint                    | Description              | Auth Required                        |
|--------|----------------------------|-------------------------|-------------------------------------|
| POST   | /api/user/login            | Login user              | No                                  |
| POST   | /api/user/create           | Register new user       | Yes + `create_user` policy          |
| GET    | /api/user/profile          | Get current user profile| Yes                                 |
| DELETE | /api/user/delete?id={id}   | Delete user             | No*                                 |
| PUT    | /api/user/:userId/role     | Update user role        | Yes + `update_user_role` policy     |



### Roles

| Method | Endpoint                         | Description               | Auth Required                               |
|--------|---------------------------------|---------------------------|--------------------------------------------|
| POST   | /api/roles/create               | Create new role           | No*                                        |
| PUT    | /api/roles/edit?id={id}         | Update role               | No*                                        |
| DELETE | /api/roles/delete?id={id}       | Delete role               | No*                                        |
| GET    | /api/roles/get-roles            | List all roles            | No                                         |
| POST   | /api/roles/:roleId/policies     | Assign policy to role     | No*                                        |
| GET    | /api/roles/:roleId/policies     | Get role's policies       | No                                         |


## Policies

| Method | Endpoint               | Description      | Auth Required                   |
|--------|-----------------------|-----------------|--------------------------------|
| POST   | /api/policy/create     | Create new policy| No*                             |
| PUT    | /api/policy/edit?id={id}| Update policy  | No*                             |



## How Authorization Works

### The authorize Middleware
Located in middleware/authorize.js -> this middleware checks if the authenticated user's role has the required policy:

```JavaScript
Copy
const { authorize } = require("../middleware/authorize");

// Protect route with specific policy
router.post('/create', authenticate, authorize('create_user'), userController.registerUser);
```

**Authorization Flow:**
1. User authenticates → JWT token contains userId and roleId
2. authenticate middleware verifies JWT and attaches user to req.user

3. authorize('policy_name') checks if user's role has that policy
    - If yes → proceed to controller
    - If no → return 403 Forbidden

**Policy Check Implementation**:

The middleware queries the database to verify the role-policy relationship:
```JavaScript
// authorize logic
const role = await Role.findByPk(req.user.roleId, {
  include: [{ model: Policy, where: { name: requiredPolicy } }]
});
if (!role) return res.status(403).json({ error: "Access denied" });
```

