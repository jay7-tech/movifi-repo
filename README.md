# Movifi - Movie Management System

A modern web application for managing and viewing movies, built with Spring Boot and React.

## Features

- **Movie Management**
  - View movies from TMDB (The Movie Database)
  - Add custom movies to your personal collection
  - Search and filter movies by title, genre, language, and region
  - Detailed movie information including ratings, release dates, and descriptions

- **User Interface**
  - Modern, responsive design
  - Tab-based navigation between TMDB movies and personal collection
  - Advanced filtering and search capabilities
  - Beautiful movie cards with hover effects
  - Loading states and error handling

- **Backend Integration**
  - RESTful API endpoints for movie management
  - Secure authentication and authorization
  - Database persistence for user data
  - Error handling and validation

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI (MUI) for components
- Axios for API calls
- Vite for build tooling

### Backend
- Spring Boot
- Spring Security with JWT
- H2 Database (development) / MySQL (production)
- Maven for dependency management

## Getting Started

### Prerequisites
- Java 17 or later
- Node.js 18 or later
- Maven 3.9.6 or later
- MySQL 8.0 (for production)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movifi-repo.git
   cd movifi-repo
   ```

2. Set up the backend:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api

## Documentation

- [API Documentation](docs/api/README.md)
- [Setup Guide](docs/setup/README.md)

## Project Structure

```
movifi-repo/
├── backend/                 # Spring Boot backend
│   ├── src/
│   └── pom.xml
├── frontend/               # React frontend
│   ├── src/
│   └── package.json
├── docs/                   # Documentation
│   ├── api/               # API documentation
│   └── setup/             # Setup guides
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing movie data
- [Material-UI](https://mui.com/) for the component library
- [Spring Boot](https://spring.io/projects/spring-boot) for the backend framework
