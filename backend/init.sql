-- Create database tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    pan_number VARCHAR(20),
    profile_image VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('customer', 'agent', 'admin')) NOT NULL,
    suspended BOOLEAN DEFAULT FALSE,
    suspended_at TIMESTAMP,
    suspended_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    agent_id INTEGER REFERENCES users(id),
    items_text TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('groceries', 'medicines', 'custom')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'picked', 'delivered', 'cancelled')) DEFAULT 'pending',
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    pickup_lat DECIMAL(10, 8),
    pickup_lng DECIMAL(11, 8),
    delivery_lat DECIMAL(10, 8),
    delivery_lng DECIMAL(11, 8),
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    tracking_updated_at TIMESTAMP,
    amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_updates (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    status VARCHAR(20) NOT NULL,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(50) DEFAULT 'cash',
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@delivery.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_agent ON orders(agent_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Table for tracking history of locations (optional)
CREATE TABLE IF NOT EXISTS order_location_updates (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    agent_id INTEGER REFERENCES users(id),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);