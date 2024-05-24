# Dream Home Real Estate App

---


This project is a full-featured real estate marketplace application built using the MERN (MongoDB, Express.js, React, and Node.js) stack. The application allows users to create, manage, and search property listings with a modern and intuitive user interface.

## Features

- **User Authentication**: Secure user authentication using JSON Web Tokens (JWT) and Google OAuth.
- **Property Listings**: Users can create, read, update, and delete property listings.
- **Image Management**: Multiple images can be uploaded for each property listing using Firebase Storage.
- **Search Functionality**: Advanced search feature with filters and sorting options to efficiently find properties.
- **User Profile Management**: Users can manage their profiles, including uploading profile images and securely deleting their accounts.
- **Responsive Design**: Built with React.js and Tailwind CSS to ensure a responsive and user-friendly interface.
- **Deployment**: The application is deployed on the Render platform.

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone hhttps://github.com/Ruvini-Rangathara/MERN-Real-Estate-App.git
   cd my-mern-estate
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set Up Environment Variables**:
   Create a `.env` file in the `backend` directory and add your environment variables.
   ```env
    MONGO=url
    JWT_SECRET='your_jwt_secret'
   ```

   Create a `.env` file in the `frontend` directory and add your environment variables.
   ```env
    VITE_FIREBASE_API_KEY="your_firebase_api_key"
   ```

---

## Running the Application

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm start
   ```

2. **Start the Frontend Server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. The application should now be running at `http://localhost:3000`.

---

## API Endpoints

The API documentation is available at [click here to see API document](https://documenter.getpostman.com/view/28283365/2sA3QpDEUF) when the backend server is running.

The API endpoints are organized into the following categories:

### Authentication

- **POST /api/auth/signup**: Register a new user.
- **POST /api/auth/signin**: Login a user.
- **POST /api/auth/signout**: Logout a user.

### Listings

- **GET /api/listing/get/:id**: Get a specific listing by ID.
- **POST /api/listing/create**: Create a new listing.
- **POST /api/listing/update/:id**: Update a listing by ID.
- **DELETE /api/listing/delete/:id**: Delete a listing by ID.
- **GET /api/listing/get**: Get all listings.

### Users

- **GET /api/user/listings/:id**: Get all listings by user ID.
- **POST /api/user/update/:id**: Update user profile by ID.
- **DELETE /api/user/delete/:id**: Delete user profile by ID.

---

## Dependencies

### Backend Dependencies

To install the backend dependencies, run the following commands:

```bash
npm i mongoose
npm i express
npm i dotenv
npm i bcryptjs
npm i jsonwebtoken
npm i cookie-parser
```

### Frontend Dependencies

To install the frontend dependencies, run the following commands:

```bash
npm install @reduxjs/toolkit react-redux
npm i redux-persist
npm install firebase
npm i swiper


npm install -D @tailwindcss/line-clamp
official site - https://github.com/tailwindlabs/tailwindcss-line-clamp
```

---

## Deployment

To deploy the application on Render or any other platform, follow the platform-specific deployment instructions.


The application is deployed on Render and can be accessed at [https://dream-home-pew6.onrender.com](https://dream-home-pew6.onrender.com).

---

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Firebase Storage

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Contact

For any inquiries or issues, please contact [ruvinisubhasinghe200009@gmail.com](mailto:ruvinisubhasinghe200009@gmail.com).

---

Happy coding! 🚀