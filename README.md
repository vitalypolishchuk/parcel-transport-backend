# Parcel Transportation Backend

This is the backend for the Parcel Transportation App, built with Express.js and PostgreSQL. It provides the API and database management for the application.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)

## Getting Started

Follow these instructions to set up and run the backend server locally.

### Prerequisites

Ensure you have the following software installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [pgAdmin](https://www.pgadmin.org/) (optional for managing PostgreSQL)

### Installation

1. **Clone the repository:**

   ```
    bash
    git clone https://github.com/vitalypolishchuk/parcel-transport-backend
    cd parcel-transport-backend
    ```


2. **Install dependencies:**
   ```
    npm install
    ```

3. **Create a .env file in the root directory of the project and add the following variables:**
    ```
    JWT_SECRET=my-key
    POSTGRES_USER=postgres
    POSTGRES_HOST=localhost
    POSTGRES_DB=parcel-transport
    POSTGRES_PASSWORD=password
    ```

4. **Run database migrations:**
    ```
    npx knex migrate:latest
    ```