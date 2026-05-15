# Contributing to HyperLocal Delivery

Thank you for your interest in contributing to HyperLocal Delivery! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Git
- Basic knowledge of React.js, Node.js, and PostgreSQL

### Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/your-username/hyperlocal-delivery-app.git
   cd hyperlocal-delivery-app
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   # Configure your database credentials in .env
   ```

3. **Database Setup**

   ```bash
   psql -d postgres -c "CREATE DATABASE delivery_app;"
   psql -d delivery_app -f backend/init.sql
   ```

4. **Install Dependencies**

   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install
   ```

5. **Start Development Servers**

   ```bash
   # Backend (Terminal 1)
   cd backend && npm run dev

   # Frontend (Terminal 2)
   cd frontend && npm start
   ```

## 📝 Development Guidelines

### Code Style

- Use consistent indentation (2 spaces)
- Follow ESLint rules for JavaScript/React
- Use meaningful variable and function names
- Add comments for complex logic

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes thoroughly
4. Commit with descriptive messages: `git commit -m "Add: user authentication feature"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

### Commit Message Format

```
Type: Brief description

Detailed description (if needed)

- Add specific changes
- Fix specific issues
- Update specific components
```

**Types**: Add, Fix, Update, Remove, Refactor, Test, Docs

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

### Manual Testing

1. Test all user roles (Customer, Agent, Admin)
2. Test real-time features (Socket.IO)
3. Test API endpoints with different scenarios
4. Verify database operations

## 📁 Project Structure

```
├── backend/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── init.sql           # Database schema
│   └── server.js          # Main server file
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── App.js         # Main app component
│   └── public/            # Static files
├── docker-compose.yml      # Docker configuration
└── README.md              # Project documentation
```

## 🐛 Bug Reports

When reporting bugs, please include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

## 💡 Feature Requests

For new features:

- Describe the feature clearly
- Explain the use case
- Consider the impact on existing functionality
- Provide mockups or examples if possible

## 🔧 Areas for Contribution

### High Priority

- [ ] Payment integration (Razorpay)
- [ ] Google Maps integration
- [ ] Push notifications
- [ ] File upload for prescriptions
- [ ] Order scheduling

### Medium Priority

- [ ] Rating and review system
- [ ] Multi-language support
- [ ] Advanced search and filters
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

### Low Priority

- [ ] Dark mode
- [ ] Email notifications
- [ ] Social media integration
- [ ] Advanced reporting
- [ ] API documentation

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Socket.IO Documentation](https://socket.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Maintain a positive environment

## 📞 Getting Help

- Open an issue for bugs or questions
- Join discussions in existing issues
- Check the README for setup instructions

## 🎉 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to making this project better! 🚀
