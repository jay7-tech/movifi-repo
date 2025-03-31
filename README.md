# Movifi - Movie Ticket Booking Platform

Movifi is a modern web application for booking movie tickets online. Built with React, TypeScript, and Spring Boot, it offers a seamless experience for users to browse movies, select seats, and purchase tickets.

## Features

- 🎬 Browse movies and view details
- 🎯 Real-time seat selection
- 💳 Secure payment processing
- 👤 User authentication and authorization
- 📱 Responsive design for all devices
- 🔒 Secure admin dashboard
- 📊 Movie management system

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Spring Boot 3
- MySQL
- Spring Security
- JWT Authentication
- Spring Data JPA

## Prerequisites

- Node.js (v18 or higher)
- Java 17 or higher
- MySQL 8.0 or higher
- Maven

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a MySQL database named `movifi`

3. Configure the database connection in `src/main/resources/application.properties`

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend (.env)
```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/movifi
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Deployment

The application is configured for deployment on Railway.app:

1. Backend deployment:
   - Connect your GitHub repository to Railway
   - Set up the required environment variables
   - Railway will automatically detect the Spring Boot application and deploy it

2. Frontend deployment:
   - The frontend is configured to build and deploy automatically via GitHub Actions
   - Environment variables are managed through Railway's dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/yourusername/movifi-repo](https://github.com/yourusername/movifi-repo)
