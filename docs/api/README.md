# Movifi API Documentation

## Authentication Endpoints

### Login
- **POST** `/api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "token": "string",
    "user": {
      "id": "number",
      "username": "string",
      "email": "string",
      "role": "USER" | "ADMIN"
    }
  }
  ```

### Register
- **POST** `/api/auth/register`
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "token": "string",
    "user": {
      "id": "number",
      "username": "string",
      "email": "string",
      "role": "USER"
    }
  }
  ```

## Movie Endpoints

### Get All Movies
- **GET** `/api/movies`
- **Response:**
  ```json
  [
    {
      "id": "number",
      "title": "string",
      "overview": "string",
      "posterPath": "string",
      "releaseDate": "string",
      "rating": "number"
    }
  ]
  ```

### Get Movie by ID
- **GET** `/api/movies/{id}`
- **Response:**
  ```json
  {
    "id": "number",
    "title": "string",
    "overview": "string",
    "posterPath": "string",
    "releaseDate": "string",
    "rating": "number"
  }
  ```

### Create Movie (Admin Only)
- **POST** `/api/movies`
- **Request Body:**
  ```json
  {
    "title": "string",
    "overview": "string",
    "posterPath": "string",
    "releaseDate": "string",
    "rating": "number"
  }
  ```

### Update Movie (Admin Only)
- **PUT** `/api/movies/{id}`
- **Request Body:**
  ```json
  {
    "title": "string",
    "overview": "string",
    "posterPath": "string",
    "releaseDate": "string",
    "rating": "number"
  }
  ```

### Delete Movie (Admin Only)
- **DELETE** `/api/movies/{id}`

## Booking Endpoints

### Create Booking
- **POST** `/api/bookings`
- **Request Body:**
  ```json
  {
    "movieId": "number",
    "showTime": "string",
    "seats": ["string"],
    "totalAmount": "number"
  }
  ```

### Get User Bookings
- **GET** `/api/bookings/user`
- **Response:**
  ```json
  [
    {
      "id": "number",
      "movieId": "number",
      "showTime": "string",
      "seats": ["string"],
      "totalAmount": "number",
      "status": "string",
      "createdAt": "string"
    }
  ]
  ```

## Error Responses
All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "string",
  "status": "BAD_REQUEST"
}
```

### 401 Unauthorized
```json
{
  "error": "string",
  "status": "UNAUTHORIZED"
}
```

### 403 Forbidden
```json
{
  "error": "string",
  "status": "FORBIDDEN"
}
```

### 404 Not Found
```json
{
  "error": "string",
  "status": "NOT_FOUND"
}
```

### 500 Internal Server Error
```json
{
  "error": "string",
  "status": "INTERNAL_SERVER_ERROR"
}
``` 