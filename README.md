add JWT_SECRET to .env

Add documentation to set up and launch express
Add documentation to install PostgreSQL

Add corresponding databases:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
