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


# User API Documentation
  - **MAIN URL:** `http://localhost:3000/api/user/`

  ### Get User Profile

  - **URL:** `/profile/:username`
  - **Method:** `GET`
  - **Description:** Get the profile of a user by username.

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

  - **404 Not Found**
    - User not found

  - **500 Internal Server Error**
    - Internal server error happened while fetching user profile

  ### Follow/Unfollow User

  - **URL:** `/follow/:id`
  - **Method:** `POST`
  - **Description:** Follow or unfollow a user by user ID.

  **Responses:**

  - **200 OK**
    - User followed/unfollowed successfully

  - **400 Bad Request**
    - You can't follow/unfollow yourself
    - User not found

  - **500 Internal Server Error**
    - Internal server error happened while following/unfollowing user

  ### Get Suggested Users

  - **URL:** `/suggested`
  - **Method:** `GET`
  - **Description:** Get a list of suggested users to follow.

  **Responses:**

  - **200 OK**
    ```json
    [
        {
            "_id": "user_id",
            "username": "johndoe",
            "fullName": "John Doe",
            "profilePicture": ""
        },
        ...
    ]
    ```

  - **500 Internal Server Error**
    - Internal server error happened while fetching suggested users

  ### Update User

  - **URL:** `/update`
  - **Method:** `POST`
  - **Description:** Update the authenticated user's profile.

  **Request Body:**
  ```json
  {
      "fullName": "John Doe",
      "username": "johndoe",
      "email": "johndoe@example.com",
      "currentPassword": "currentpassword123",
      "newPassword": "newpassword123",
      "bio": "This is my bio",
      "link": "http://example.com",
      "profilePicture": "profile_picture_url",
      "coverPicture": "cover_picture_url"
  }
  ```

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
        "profilePicture": "profile_picture_url",
        "coverPicture": "cover_picture_url",
        "bio": "This is my bio",
        "link": "http://example.com",
        "likedPosts": []
    }
    ```

  - **400 Bad Request**
    - Invalid current password or new password

  - **500 Internal Server Error**
    - Internal server error happened while updating user profile

# Notification API Documentation
  - **MAIN URL:** `http://localhost:3000/api/notification/`

  ### Get Notifications

  - **URL:** `/`
  - **Method:** `GET`
  - **Description:** Get notifications for the authenticated user.

  **Responses:**

  - **200 OK**
    ```json
    [
        {
            "_id": "notification_id",
            "from": {
                "_id": "user_id",
                "username": "johndoe",
                "profilePicture": "profile_picture_url"
            },
            "to": "user_id",
            "type": "like",
            "read": true,
            "createdAt": "2023-10-01T00:00:00.000Z",
            "updatedAt": "2023-10-01T00:00:00.000Z"
        },
        ...
    ]
    ```

  - **500 Internal Server Error**
    - Internal server error happened while fetching notifications

  ### Delete Notifications

  - **URL:** `/`
  - **Method:** `DELETE`
  - **Description:** Delete all notifications for the authenticated user.

  **Responses:**

  - **200 OK**
    - Notifications deleted successfully

  - **500 Internal Server Error**
    - Internal server error happened while deleting notifications

# Post API Documentation
  - **MAIN URL:** `http://localhost:3000/api/posts/`

  ### Create Post

  - **URL:** `/create`
  - **Method:** `POST`
  - **Description:** Create a new post.

  **Request Body:**
  ```json
  {
      "text": "This is a new post",
      "img": "image_url"
  }
  ```

  **Responses:**

  - **201 Created**
    ```json
    {
        "_id": "post_id",
        "user": "user_id",
        "text": "This is a new post",
        "img": "image_url",
        "likes": [],
        "comments": [],
        "createdAt": "2023-10-01T00:00:00.000Z",
        "updatedAt": "2023-10-01T00:00:00.000Z"
    }
    ```

  - **500 Internal Server Error**
    - Internal server error happened while creating post

  ### Delete Post

  - **URL:** `/:id`
  - **Method:** `DELETE`
  - **Description:** Delete a post by post ID.

  **Responses:**

  - **200 OK**
    - Post deleted successfully

  - **404 Not Found**
    - Post not found

  - **500 Internal Server Error**
    - Internal server error happened while deleting post

  ### Comment on Post

  - **URL:** `/comment/:id`
  - **Method:** `POST`
  - **Description:** Comment on a post by post ID.

  **Request Body:**
  ```json
  {
      "text": "This is a comment"
  }
  ```

  **Responses:**

  - **200 OK**
    ```json
    {
        "_id": "post_id",
        "user": "user_id",
        "text": "This is a new post",
        "img": "image_url",
        "likes": [],
        "comments": [
            {
                "text": "This is a comment",
                "user": "user_id"
            }
        ],
        "createdAt": "2023-10-01T00:00:00.000Z",
        "updatedAt": "2023-10-01T00:00:00.000Z"
    }
    ```

  - **404 Not Found**
    - Post not found

  - **500 Internal Server Error**
    - Internal server error happened while commenting on post

  ### Like/Unlike Post

  - **URL:** `/like/:id`
  - **Method:** `POST`
  - **Description:** Like or unlike a post by post ID.

  **Responses:**

  - **200 OK**
    - Post liked/unliked successfully

  - **404 Not Found**
    - Post not found

  - **500 Internal Server Error**
    - Internal server error happened while liking/unliking post

  ### Get All Posts

  - **URL:** `/all`
  - **Method:** `GET`
  - **Description:** Get all posts.

  **Responses:**

  - **200 OK**
    ```json
    [
        {
            "_id": "post_id",
            "user": {
                "_id": "user_id",
                "username": "johndoe",
                "profilePicture": "profile_picture_url"
            },
            "text": "This is a new post",
            "img": "image_url",
            "likes": [],
            "comments": [],
            "createdAt": "2023-10-01T00:00:00.000Z",
            "updatedAt": "2023-10-01T00:00:00.000Z"
        },
        ...
    ]
    ```

  - **500 Internal Server Error**
    - Internal server error happened while fetching posts

  ### Get Liked Posts

  - **URL:** `/likes/:id`
  - **Method:** `GET`
  - **Description:** Get liked posts of a user by user ID.

  **Responses:**

  - **200 OK**
    ```json
    [
        {
            "_id": "post_id",
            "user": {
                "_id": "user_id",
                "username": "johndoe",
                "profilePicture": "profile_picture_url"
            },
            "text": "This is a new post",
            "img": "image_url",
            "likes": [],
            "comments": [],
            "createdAt": "2023-10-01T00:00:00.000Z",
            "updatedAt": "2023-10-01T00:00:00.000Z"
        },
        ...
    ]
    ```

  - **500 Internal Server Error**
    - Internal server error happened while fetching liked posts

  ### Get Following Posts

  - **URL:** `/following`
  - **Method:** `GET`
  - **Description:** Get posts of users whom the authenticated user is following.

  **Responses:**

  - **200 OK**
    ```json
    [
        {
            "_id": "post_id",
            "user": {
                "_id": "user_id",
                "username": "johndoe",
                "profilePicture": "profile_picture_url"
            },
            "text": "This is a new post",
            "img": "image_url",
            "likes": [],
            "comments": [],
            "createdAt": "2023-10-01T00:00:00.000Z",
            "updatedAt": "2023-10-01T00:00:00.000Z"
        },
        ...
    ]
    ```

  - **500 Internal Server Error**
    - Internal server error happened while fetching following posts

  ### Get User Posts

  - **URL:** `/user/:username`
  - **Method:** `GET`
  - **Description:** Get posts of a user by username.

  **Responses:**

  - **200 OK**
    ```json
    [
        {
            "_id": "post_id",
            "user": {
                "_id": "user_id",
                "username": "johndoe",
                "profilePicture": "profile_picture_url"
            },
            "text": "This is a new post",
            "img": "image_url",
            "likes": [],
            "comments": [],
            "createdAt": "2023-10-01T00:00:00.000Z",
            "updatedAt": "2023-10-01T00:00:00.000Z"
        },
        ...
    ]
    ```

  - **500 Internal Server Error**
    - Internal server error happened while fetching user posts