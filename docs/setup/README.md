# Movifi Setup Guide

## Development Environment Setup

### Prerequisites
1. Java Development Kit (JDK) 17 or later
2. Maven 3.9.6 or later
3. Node.js 18 or later
4. npm 9 or later
5. Git

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movifi-repo.git
   cd movifi-repo
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Build the project:
   ```bash
   mvn clean install
   ```

4. Configure the database:
   - The application uses H2 in-memory database by default
   - To use MySQL, update `application.properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/movifi
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

5. Run the application:
   ```bash
   mvn spring-boot:run
   ```

6. Verify the backend is running:
   - Open http://localhost:8080 in your browser
   - You should see the welcome message

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Production Deployment

### Backend Deployment

1. Build the production JAR:
   ```bash
   mvn clean package -Pprod
   ```

2. The JAR file will be created in `target/movifi-0.0.1-SNAPSHOT.jar`

3. Run the JAR:
   ```bash
   java -jar target/movifi-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. The build files will be in the `dist` directory

3. Deploy the `dist` directory to your web server

## Database Setup

### H2 Database (Development)
- Access H2 Console: http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:movifidb
- Username: sa
- Password: password

### MySQL Database (Production)
1. Create the database:
   ```sql
   CREATE DATABASE movifi;
   ```

2. Update application.properties with MySQL credentials

## Security Configuration

1. JWT Configuration:
   - Secret key is configured in `application.properties`
   - Token expiration: 24 hours

2. CORS Configuration:
   - Allowed origins: http://localhost:3000, http://localhost:3001
   - Allowed methods: GET, POST, PUT, DELETE, OPTIONS
   - Allowed headers: All

## Monitoring and Logging

1. Application logs:
   - Location: `logs/application.log`
   - Level: INFO
   - Format: JSON

2. Health check endpoint:
   - URL: http://localhost:8080/actuator/health
   - Method: GET

## Troubleshooting

### Common Issues

1. Backend won't start:
   - Check if port 8080 is available
   - Verify database connection
   - Check application logs

2. Frontend won't connect to backend:
   - Verify backend is running
   - Check CORS configuration
   - Verify API base URL in .env

3. Database connection issues:
   - Check database credentials
   - Verify database is running
   - Check network connectivity

### Getting Help

1. Check the documentation:
   - API docs: `/docs/api`
   - Setup guide: `/docs/setup`

2. Contact support:
   - Email: support@movifi.com
   - GitHub Issues: https://github.com/yourusername/movifi-repo/issues 