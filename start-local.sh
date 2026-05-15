#!/bin/bash

echo "Starting HyperLocal Delivery..."

# Check if PostgreSQL is running
if ! pgrep -x "postgres" > /dev/null; then
    echo "PostgreSQL is not running. Please start PostgreSQL first."
    echo "   On macOS with Homebrew: brew services start postgresql"
    exit 1
fi

# Check if database exists
if ! psql -d delivery_app -c '\q' 2>/dev/null; then
    echo "Setting up database..."
    psql -d postgres -c "CREATE DATABASE delivery_app;" 2>/dev/null || true
    psql -d delivery_app -f backend/init.sql
fi

echo "🔧 Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting frontend server..."
cd ../frontend && npm start &
FRONTEND_PID=$!

echo "Application started successfully!"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5001"
echo ""
echo "Demo Admin Login:"
echo "   Email: admin@delivery.com"
echo "   Password: password"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait