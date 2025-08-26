-- This script defines the database schema for the Rapido Clone application.

-- Create a custom type for the user role
CREATE TYPE user_role AS ENUM ('rider', 'driver');

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    role user_role NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note: In a production environment, you might want to add more constraints,
-- indexes for performance (e.g., on email, phone), and other tables.
