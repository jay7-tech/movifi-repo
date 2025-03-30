# Movifi - Show Booking Application

A modern web application for booking shows and events, built with Spring Boot and vanilla JavaScript.

## Project Structure

```
movifi-repo/
├── backend/                      # Spring Boot Backend
│   
├── frontend/                    # Frontend Application
│
├── docs/                       # Documentation
└── README.md                   # Project root README
```

## Prerequisites

- Java 17
- Maven 3.9.6
- MySQL 8.0.36
- Node.js (for development)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Build the project:

   ```bash
   mvn clean install
   ```

3. Configure the database:

   - Create a MySQL database named 'movifi'
   - Update application.properties with your database credentials

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Serve the application using a local server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Features

- User Authentication (Login/Register)
- Show Listing and Details
- Seat Selection
- Booking Management
- Payment Integration
- Responsive Design
- Real-time Updates

## API Documentation

API documentation is available in the `docs/api` directory.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
