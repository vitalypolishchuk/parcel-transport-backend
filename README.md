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


CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    user_email: TEXT NOT NULL,
    request_type VARCHAR(10) NOT NULL CHECK (request_type IN ('order', 'delivery')),
    from_city VARCHAR(100) NOT NULL, -- Adjust size as needed
    to_city VARCHAR(100) NOT NULL,   -- Adjust size as needed
    parcel_type VARCHAR(50),         -- Adjust size as needed
    dispatch_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
