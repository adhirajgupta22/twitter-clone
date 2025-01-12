# Authentication API Documentation
- **MAIN URL:** `http://localhost:3000/api/auth/`

## Endpoints

### Signup

- **URL:** `/signup`
- **Method:** `POST`
- **Description:** Register a new user.

**Request Body:**
```json
{
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "password123"
}
```

**Responses:**

- **201 Created**
  ```json
  {
      "_id": "user_id",
      "fullName": "John Doe",
      "username": "johndoe",
      "email": "johndoe@example.com",
      "profilePicture": "",
      "followers": [],
      "following": [],
      "coverPicture": ""
  }
  ```

- **400 Bad Request**
  - Invalid email format
  - Username already exists
  - Email already exists
  - Password must be at least 6 characters long

- **500 Internal Server Error**
  - Internal server error happened while signup

### Login

- **URL:** `/login`
- **Method:** `POST`
- **Description:** Authenticate a user.

**Request Body:**
```json
{
    "username": "johndoe",
    "password": "password123"
}
```

**Responses:**

- **200 OK**
  ```json
  {
      "_id": "user_id",
      "fullName": "John Doe",
      "username": "johndoe",
      "email": "johndoe@example.com",
      "profilePicture": "",
      "followers": [],
      "following": [],
      "coverPicture": ""
  }
  ```

- **400 Bad Request**
  - Invalid username or password

- **500 Internal Server Error**
  - Internal server error happened while login

### Logout

- **URL:** `/logout`
- **Method:** `POST`
- **Description:** Logout a user.

**Responses:**

- **200 OK**
  - Logged out successfully

- **400 Bad Request**
  - No token found => login to kr laude

- **500 Internal Server Error**
  - Internal server error happened while logout

### Get Profile

- **URL:** `/me`
- **Method:** `GET`
- **Description:** Get the profile of the authenticated user.

**Responses:**

- **200 OK**
  ```json
  {
      "_id": "user_id",
      "username": "johndoe",
      "fullName": "John Doe",
      "email": "johndoe@example.com",
      "followers": [],
      "following": [],
      "profilePicture": "",
      "coverPicture": "",
      "bio": "",
      "link": "",
      "likedPosts": []
  }
  ```

- **401 Unauthorized**
  - No token found
  - Invalid token
  - No user found

- **500 Internal Server Error**
  - Internal server error happened while fetching user profile

## Middleware

### Profile Middleware

- **Description:** Middleware to authenticate the user using JWT token from cookies.

**Error Responses:**

- **401 Unauthorized**
  - No token found
  - Invalid token
  - No user found

- **500 Internal Server Error**
  - Internal server error in profile middleware
