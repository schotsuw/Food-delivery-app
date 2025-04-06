# Food Delivery App

A microservices-based food delivery application with React frontend and Spring Boot backend services.

## Project Structure

- **food-frontend**: React frontend built with Vite
- **Microservices**:
  - **apiGateway**: API Gateway service for routing requests
  - **orderService**: Service for managing food orders
  - **paymentService**: Service for handling payments
  - **trackingService**: Service for tracking order deliveries
  - **notificationService**: Service for sending notifications

## Prerequisites

- Node.js (v18+)
- Java 21 JDK
- MongoDB
- RabbitMQ

## Setup Instructions

### 1. Backend Services Setup

Each microservice follows a similar setup process:

```bash
# Clone the repository
git clone <repository-url>
cd Food-delivery-app

# For each service (replace 'serviceName' with each service)
cd serviceName

# Create an .env file from the example
cp .env.example .env
# Edit .env with your MongoDB connection string
```

Update the `.env` file for each service with appropriate configuration:
- MongoDB connection string
- Any other required secrets or configuration

#### Application Properties Configuration

Each microservice uses Spring Boot's `application.properties` for configuration. You should configure these properties:

1. Open or create `src/main/resources/application.properties` in each service
2. Configure the necessary properties:

```properties
# Example properties (adjust as needed for each service)
server.port=8081  # Different port for each service
spring.data.mongodb.uri=${MONGO_KEY}
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
```

#### Setting Up Environment Variables in IntelliJ IDEA

If you're using IntelliJ IDEA to run the services:

1. Open the service project in IntelliJ
2. Go to Run → Edit Configurations
3. Select your Spring Boot application configuration
4. In the "Environment variables" field, add:
   ```
   MONGO_KEY=mongodb://localhost:27017/your_database_name
   ```
5. Apply and save the configuration

Repeat for each microservice with appropriate values.

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd food-frontend

# Install dependencies
npm install

# Create .env file with necessary API keys
# The .env should contain:
VITE_GOOGLE_MAP_API_KEY=your_google_maps_api_key
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_CLIENT_ID=your_auth0_client_id
```

## Running the Application

### 1. Start Backend Services

Run each microservice:

```bash
# In separate terminal windows for each service
cd serviceName
./gradlew bootRun
```

Start the services in this order:
1. API Gateway
2. Order Service
3. Payment Service
4. Tracking Service
5. Notification Service

### 2. Start Frontend

```bash
cd food-frontend
npm run dev
```

The frontend application will be available at `http://localhost:5173`.

## API Documentation

The API Gateway exposes endpoints on port 8080:
- Orders API: `/api/orders/**`
- Payments API: `/api/payments/**`
- Tracking API: `/api/tracking/**`
- Notifications API: `/api/notifications/**`

## Technologies Used

- **Frontend**: 
  - React 19
  - Vite
  - Material UI
  - React Router
  - Auth0 for authentication
  - Google Maps API for location services

- **Backend**:
  - Spring Boot 3
  - Spring Data MongoDB
  - RabbitMQ for inter-service communication
  - Spring Cloud Gateway

## Docker Support

For containerized deployment, Docker Compose can be used to start all services:

```bash
# From project root
docker-compose up
```

## Troubleshooting

- Ensure MongoDB and RabbitMQ are running
- Check each service's logs for connection issues
- Verify environment variables are set correctly in all .env files 
- If using IntelliJ, verify environment variables are correctly set in Run Configurations 