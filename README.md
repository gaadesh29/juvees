# Juvees E-commerce Platform

A modern e-commerce platform built with React, TypeScript, and Node.js.

## Features

- User authentication and authorization
- Product browsing and search
- Shopping cart functionality
- Order management
- Admin dashboard
- Real-time notifications
- Responsive design

## Tech Stack

### Frontend
- React
- TypeScript
- Redux Toolkit
- React Router
- Tailwind CSS
- Jest & React Testing Library

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Socket.IO

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/juvees.git
cd juvees
```

2. Install dependencies:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
```

3. Set up environment variables:
```bash
# In the root directory
cp .env.example .env

# In the client directory
cd client
cp .env.example .env
```

4. Start the development servers:
```bash
# Start the backend server (from root directory)
npm run dev

# Start the frontend development server (from client directory)
cd client
npm start
```

## Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
npm test
```

## Deployment

1. Build the frontend:
```bash
cd client
npm run build
```

2. Deploy the backend:
```bash
npm run build
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

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/) 