# Buddy Script Backend Boilerplate

A clean, production-ready Node.js/Express backend boilerplate with modular architecture.

## Features

- **Modular Architecture** - Easy module generation using built-in script
- **Authentication** - JWT-based authentication middleware
- **Validation** - Request validation using Joi
- **Error Handling** - Centralized error handling
- **Security** - Helmet, rate limiting, HPP, CORS, mongo-sanitize
- **Code Quality** - ESLint + Prettier pre-configured
- **Database** - MongoDB with Mongoose ODM

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` and configure your environment variables.

### 3. Run Development Server

```bash
npm run dev
```

### 4. Create a New Module

```bash
npm run module <moduleName>
```

Example:

```bash
npm run module user
```

This creates:

```
src/modules/user/
├── controllers/
│   └── userController.js
├── models/
│   └── userModel.js
├── routes/
│   └── userRoutes.js
├── services/
│   └── userService.js
├── validations/
│   └── userValidation.js
└── index.js
```

## Project Structure

```
src/
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── config/
│   └── db.js          # Database connection
├── middleware/
│   ├── authMiddleware.js
│   └── validatorMiddleware.js
├── modules/           # Feature modules
│   └── index.js
└── utils/
    ├── apiError.js
    ├── apiResponse.js
    ├── catchAsync.js
    ├── customJoi.js
    ├── errorHandler.js
    └── jwtToken.js
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run module <name>` - Generate new module
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## Authentication

The boilerplate includes JWT authentication middleware. Use it in your routes:

```javascript
const authenticate = require('./middleware/authMiddleware');

router.get('/protected', authenticate, controller.protectedRoute);
```

## Validation

Use the validation middleware with Joi schemas:

```javascript
const validate = require('./middleware/validatorMiddleware');
const { userValidation } = require('./modules/user/validations/userValidation');

router.post('/users', validate(userValidation.createUser), controller.createUser);
```

## Error Handling

Use the `catchAsync` wrapper for async route handlers:

```javascript
const catchAsync = require('./utils/catchAsync');

const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();
  res.json(new ApiResponse(200, users, 'Users retrieved successfully'));
});
```

Throw errors using `ApiError`:

```javascript
const ApiError = require('./utils/apiError');

throw new ApiError(404, 'User not found');
```

## License

ISC
