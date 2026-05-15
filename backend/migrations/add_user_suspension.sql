-- Migration to add user suspension functionality
-- Run this if you have an existing database

-- Add suspension columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS suspended_by INTEGER REFERENCES users(id);

-- Create index for better performance on suspension queries
CREATE INDEX IF NOT EXISTS idx_users_suspended ON users(suspended);

-- Update existing users to have suspended = FALSE (just to be explicit)
UPDATE users SET suspended = FALSE WHERE suspended IS NULL;