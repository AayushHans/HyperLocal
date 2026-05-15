# HyperLocal Delivery

A lightweight hyperlocal delivery application similar to Dunzo/Zepto Genie, built with React.js, Node.js, Socket.IO, and PostgreSQL. The app supports three user roles: Customer, Delivery Partner (Agent), and Admin.

## Features

### Customer Module

- Sign up / Log in
- Create orders with categories (Groceries, Medicines, Custom Shop)
- Add text-based item lists with **AI-powered NLP assistance**
  - Write orders in Hindi (आलू), Romanized Hindi (aloo), English, or Hinglish
  - Example: "Ek Kilo Aata" → "Wheat flour - 1 kg"
  - Automatic translation and clarification suggestions
  - Smart formatting for clearer communication
  - 250+ word dictionary covering vegetables, fruits, grains, medicines
- Enter pickup and delivery addresses
- View order history and live status updates via Socket.IO

### Delivery Partner Module

- Login / Register as delivery partner
- View available orders in real-time
- Accept / Reject orders
- Update order status (Picked → Delivered)
- View completed deliveries

### Admin Panel

- View all customers, agents, and orders
- Filter orders by status
- Dashboard with statistics
- Monitor active and completed deliveries
- Suspend/unsuspend user and agent accounts
- User account management with status tracking

## 🛠️ Tech Stack

- **Frontend**: React.js + TailwindCSS
- **Backend**: Node.js (Express.js) + Socket.IO
- **Database**: PostgreSQL
- **Authentication**: JWT
- **NLP**: Custom Hindi-English translation engine
- **Deployment**: Docker + docker-compose

## Prerequisites

### For Docker Setup

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

### For Local Development

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Git

## Quick Start

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/shubhranshu-pandey/hyperlocal-delivery-app
   cd hyperlocal-delivery-app
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   # Edit .env files with your configuration
   ```

3. **Start with Docker**
   ```bash
   docker-compose up --build
   ```

### Option 2: Local Development Setup

1. **Clone and setup**

   ```bash
   git clone https://github.com/shubhranshu-pandey/hyperlocal-delivery-app
   cd hyperlocal-delivery-app

   # Copy environment files
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   # Edit the .env files with your database credentials
   ```

2. **Database setup**

   ```bash
   # Create database (adjust username as needed)
   psql -d postgres -c "CREATE DATABASE delivery_app;"

   # Run migrations
   psql -d delivery_app -f backend/init.sql
   ```

3. **Install dependencies and start**

   ```bash
   # Backend
   cd backend && npm install
   npm run dev

   # Frontend (in new terminal)
   cd frontend && npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - Database: localhost:5432

## Demo Accounts

### Admin Account

- Email: `admin@delivery.com`
- Password: `password`

### Test Accounts

You can register new accounts for:

- **Customer**: Choose "Customer" role during registration
- **Delivery Partner**: Choose "Delivery Partner" role during registration

## How to Use

### For Customers:

1. Register/Login as a customer
2. Go to "Create Order" tab
3. Select category (Groceries/Medicines/Custom)
4. Add items description
5. Enter pickup and delivery addresses
6. Submit order
7. Track order status in "My Orders" tab

### For Delivery Partners:

1. Register/Login as a delivery partner
2. View "Available Orders" tab for new orders
3. Accept orders you want to deliver
4. Go to "My Deliveries" tab
5. Update order status as you progress:
   - Mark as "Picked" when you collect items
   - Mark as "Delivered" when completed

### For Admins:

1. Login with admin credentials
2. View dashboard statistics
3. Monitor all orders and users
4. Filter orders by status
5. View user management
6. Suspend/unsuspend user or agent accounts
7. Monitor account status and activity

## Database Schema

### Users Table

- `id`, `name`, `email`, `phone`, `password`, `role`, `suspended`, `suspended_at`, `suspended_by`, `created_at`

### Orders Table

- `id`, `customer_id`, `agent_id`, `items_text`, `category`, `status`
- `pickup_address`, `delivery_address`, `created_at`, `updated_at`

### Order Updates Table

- `id`, `order_id`, `status`, `message`, `timestamp`

### Payments Table (Optional)

- `id`, `order_id`, `amount`, `method`, `status`, `transaction_id`

## System Flow

1. **Customer creates order** → Backend stores it → Socket.IO broadcasts to nearby agents
2. **Agent accepts order** → Backend assigns order → Customer sees "Accepted" status
3. **Agent picks items** → Updates status → Customer sees real-time updates
4. **Agent delivers** → Updates to "Delivered" → Order completed
5. **Admin monitors** → Views all activities on dashboard

## Docker Services

The application runs three main services:

- **frontend**: React development server (Port 3000)
- **backend**: Node.js + Express + Socket.IO (Port 5000)
- **db**: PostgreSQL database (Port 5432)

## Development

### Environment Variables

**Important**: Copy the example environment files and configure them:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

Key environment variables in `.env`:

```env
# Database Configuration
DB_HOST=localhost                    # Database host
DB_PORT=5432                        # Database port
DB_NAME=delivery_app                # Database name
DB_USER=your_username               # Your PostgreSQL username
DB_PASSWORD=your_password           # Your PostgreSQL password

# JWT Secret (IMPORTANT: Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# API URLs
REACT_APP_API_URL=http://localhost:5001
REACT_APP_SOCKET_URL=http://localhost:5001

# Optional: Google Maps & Razorpay
GOOGLE_MAPS_API_KEY=your-api-key
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
```

**Security Note**: Never commit `.env` files to version control. They contain sensitive information like database passwords and API keys.

### API Endpoints

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Orders

- `POST /api/orders` - Create new order (Customer)
- `GET /api/orders/available` - Get available orders (Agent)
- `POST /api/orders/:id/accept` - Accept order (Agent)
- `PUT /api/orders/:id/status` - Update order status (Agent)
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/all` - Get all orders (Admin)

#### Users

- `GET /api/users` - Get all users (Admin)
- `GET /api/users/profile` - Get user profile
- `GET /api/users/dashboard-stats` - Get dashboard statistics (Admin)
- `PUT /api/users/:userId/suspend` - Suspend user account (Admin)
- `PUT /api/users/:userId/unsuspend` - Unsuspend user account (Admin)

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   docker-compose down
   docker-compose up --build
   ```

2. **Database connection issues**

   - Wait for PostgreSQL to fully initialize
   - Check if port 5432 is available

3. **Frontend not loading**
   - Ensure port 3000 is available
   - Check if backend is running on port 5000

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db
```

## Stretch Goals (Future Enhancements)

- [ ] Payment integration with Razorpay
- [ ] Google Maps integration for location tracking
- [ ] Push notifications via Firebase
- [ ] File upload for prescriptions
- [ ] Real-time location tracking
- [ ] Rating and review system
- [ ] Order scheduling
- [ ] Multi-language support

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For support and questions, please open an issue in the repository.

---

**Happy Delivering!**
#   H y p e r L o c a l  
 