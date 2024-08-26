import pool from "../config/db"
import { User } from "../types/User";

export const addUser = async (email: string, password_hash: string): Promise<User> => {
    try {
        // Insert the new user into the database and return the inserted user details
        const result = await pool.query(`
            INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email
        `, [email, password_hash]);

        // Check if the insert operation was successful
        if (result.rowCount === 0) {
            throw new Error("Error occurred trying to add a new user");
        }

        return result.rows[0];
    } catch (err: any) {
        console.error('Error adding user:', err);
        throw new Error(err.message || "An unexpected error occurred");
    }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const result = await pool.query(`
            SELECT * FROM users 
            WHERE email = $1
        `, [email]);

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    } catch (err: any) {
        console.error(err);
        throw new Error(err.message || "An unexpected error occurred");
    }
};