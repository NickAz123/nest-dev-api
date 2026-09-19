-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create indexes for common query patterns
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- INSERT STATEMENTS

INSERT INTO users (first_name, last_name, username, password, email, is_deleted) VALUES
('Jane', 'Foster', 'jdfoster', '', 'jane.foster@example.com', false),
('Richard', 'Miller', 'richardm19', '', 'richard.miller@example.com', true),
('Barrys', 'Bonds', 'thebarrybb88', '', 'barrys.bonds@example.com', false),
('Harold', 'Foster', 'hryfoster', '', 'harold.foster@example.com', false);