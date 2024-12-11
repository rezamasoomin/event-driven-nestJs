# Event-Driven Microservices with NestJS

A modern microservices architecture implementation using NestJS, Kafka, and Event Sourcing patterns. This project demonstrates how to build scalable and maintainable microservices using CQRS and Event Sourcing principles.

## Project Structure

```
EVENT-DRIVEN-NESTJS/
├── api-gateway/               # API Gateway service
├── inventory-service/         # Inventory management service
├── order-service/            # Order management service
│   ├── src/
│   │   ├── api/
│   │   │   └── controllers/  # API Controllers
│   │   ├── application/
│   │   │   ├── handlers/     # Command and Event Handlers
│   │   │   └── sagas/       # Sagas for process management
│   │   ├── domain/
│   │   │   ├── aggregates/  # Domain Aggregates
│   │   │   ├── commands/    # Command Definitions
│   │   │   ├── events/      # Event Definitions
│   │   │   └── interfaces/  # Domain Interfaces
│   │   └── infrastructure/
│   │       ├── persistence/ # Database and Event Store
│   │       └── messaging/   # Kafka Integration
├── payment-service/          # Payment processing service
├── shared-lib/              # Shared code and utilities
│   ├── src/
│   │   ├── commands/        # Shared Commands
│   │   ├── events/          # Shared Events
│   │   ├── interfaces/      # Shared Interfaces
│   │   └── utils/          # Utility Functions
└── docker-compose.yml       # Docker composition for services
```

## Features

- ✨ Event-Driven Architecture
- 🎯 CQRS Pattern Implementation
- 📊 Event Sourcing
- 🚀 Microservices Architecture
- 🔄 Apache Kafka Integration
- 🛡️ TypeScript Support
- 🐳 Docker Support

## Current Implementation

### Order Service
- Create Order API with Event Sourcing
- Command and Event Handlers
- Database persistence with TypeORM
- Event Store implementation
- Kafka integration for event publishing

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MySQL
- Apache Kafka

## Getting Started

1. Clone the repository:
```bash
git clone [your-repository-url]
cd event-driven-nestjs
```

2. Install dependencies:
```bash
# Install shared library dependencies
cd shared-lib
npm install

# Install service dependencies
cd ../order-service
npm install
```

3. Start the infrastructure services:
```bash
docker-compose up -d
```

4. Run the services:
```bash
# Start order service
cd order-service
npm run start:dev
```

## API Endpoints

### Order Service
- `POST /api/orders` - Create a new order
  ```json
  {
    "userId": "string",
    "items": [
      {
        "id": "string",
        "quantity": number,
        "price": number
      }
    ]
  }
  ```

## Architecture

This project follows these architectural patterns:
- **Event Sourcing**: All changes to the domain objects are stored as a sequence of events
- **CQRS**: Separation of command and query responsibilities
- **Microservices**: Distributed system with separate services for different business capabilities

## Technical Stack

- **Framework**: NestJS
- **Message Broker**: Apache Kafka
- **Database**: MySQL
- **ORM**: TypeORM
- **API Documentation**: Swagger (coming soon)
- **Container**: Docker
- **Language**: TypeScript

## Upcoming Features

- [ ] Inventory Service Implementation
- [ ] Payment Service Integration
- [ ] API Gateway Implementation
- [ ] Service Discovery
- [ ] Distributed Tracing
- [ ] API Documentation
- [ ] Unit and Integration Tests
- [ ] CI/CD Pipeline

## Development

```bash
# Start development server
npm run start:dev

# Build the project
npm run build

# Run tests (coming soon)
npm run test
```

## Docker Support

The project includes Docker support for easy development and deployment:

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## Running with Docker

The services are containerized using Docker. Use the following commands to run the entire system:

1. Start the services:
```bash
docker-compose up -d
```

2. Check service status:
```bash
docker-compose ps
```

3. View service logs:
```bash
docker-compose logs -f [service-name]
```

4. Stop the services:
```bash
docker-compose down
```

## Environment Configuration

Each service requires specific environment variables. Create a `.env` file in each service directory:

### Order Service
```env
# Database
DB_HOST=mysql
DB_PORT=3306
DB_USER=user
DB_PASS=password
DB_NAME=eventstore

# Kafka
KAFKA_BROKER=kafka:9092
KAFKA_GROUP_ID=order-service-group
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Reza Masoomi Niaragh - rezamasoomi.n@gmail.com

Project Link: [https://github.com/rezamasoomin/event-driven-nestJs](https://github.com/rezamasoomin/event-driven-nestJs)
