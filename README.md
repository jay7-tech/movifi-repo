# Movifi - Show Booking Application

A modern web application for booking shows and events, built with Spring Boot and vanilla JavaScript.

## Project Structure

```
movifi-repo/
├── backend/                      # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── movifi/
│   │   │   │           ├── MovifiApplication.java
│   │   │   │           ├── config/           # Configuration classes
│   │   │   │           ├── controller/       # REST controllers
│   │   │   │           ├── model/           # Entity classes
│   │   │   │           ├── repository/      # JPA repositories
│   │   │   │           ├── service/         # Business logic
│   │   │   │           ├── security/        # Security configuration
│   │   │   │           └── util/            # Utility classes
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-dev.properties
│   │   │       └── application-prod.properties
│   │   └── test/              # Test classes
│   ├── pom.xml
│   └── README.md
│
├── frontend/                    # Frontend Application
│   ├── src/
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── css/               # CSS files
│   │   ├── js/                # JavaScript files
│   │   └── pages/             # HTML pages
│   ├── index.html
│   └── README.md
│
├── docs/                       # Documentation
│   ├── api/                   # API documentation
│   └── setup/                 # Setup guides
│
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
   # Using Python
   python -m http.server 5500

   # Or using Node.js
   npx serve
   ```

3. Open http://localhost:5500 in your browser

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
