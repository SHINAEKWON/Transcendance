# Transcendance

## 📖 Description
Transcendance is a full-stack web application developed as part of the 42 School curriculum. It features a real-time multiplayer Pong game, integrated chat system, user authentication, and profile management. The project emphasizes microservices architecture, real-time communication, and modern web development practices.

This application serves as a comprehensive example of building scalable web apps with containerization and inter-service communication.

---

## ⚙️ Features
- Real-time multiplayer Pong game
- Integrated chat system with WebSocket support
- User authentication with Google OAuth
- Profile management with avatar uploads
- Tournament system for competitive play
- Responsive design for desktop and mobile
- Microservices backend architecture
- Containerized deployment with Docker

---

## 🛠️ Services Overview

### 🔐 Auth Service
- User registration and login
- JWT token management
- Google OAuth integration
- Session handling

### 💬 Chat Service
- Real-time messaging
- Channel management
- WebSocket communication
- Message persistence

### 🎮 Game Service
- Game logic and matchmaking
- Real-time game state updates
- AI opponent support
- Tournament management

### 👤 User Service
- User profile management
- Avatar upload and storage
- User statistics tracking
- File handling with Multer

### 🌐 Frontend
- Single-page application
- Game interface and controls
- Chat UI integration
- Responsive layout with CSS

---
## 👷‍♀️ Setup and Compilation
To set up and run the project, use Docker Compose:

```bash
make up  # or docker-compose up --build
```

This will build and start all services.

Available Makefile Rules

```bash
make up      # Start all services
make down    # Stop all services
make build   # Build Docker images
make clean   # Remove containers and volumes
make logs    # View service logs
```

For local development:
```bash
# Install dependencies for each service
npm install  # in each service directory

# Run services individually
npm run dev  # in each service
```

---

## 💡 What I Learned
- Microservices architecture and inter-service communication
- Real-time application development with WebSockets
- Containerization and orchestration with Docker
- Full-stack development with TypeScript
- Authentication and security best practices
- Database design and management
- Frontend state management and UI/UX design
- Debugging distributed systems
- Agile development and project organization