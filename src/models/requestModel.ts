import pool from "../config/db";
import { RequestCamel } from "../types/Request";

export const getRequests = async (email: string): Promise<RequestCamel[]> => {
    try {
        const result = await pool.query(`
            SELECT * FROM requests
            WHERE user_email = $1  
        `, [email]);

        const requestCamelCase = result.rows.map((request: any) => ({
            id: request.id,
            requestType: request.request_type,
            fromCity: request.from_city,
            toCity: request.to_city,
            parcelType: request.parcelType,
            dispatchDate: request.dispatch_date,
            description: request.description,
            createdAt: request.created_at,
            updatedAt: request.updated_at
        }));

        return requestCamelCase;
    } catch (err: any) {
        console.error(err);
        throw new Error(err.message || "An unexpected error occurred");
    }
};

export const deleteRequest = async (id: string): Promise<{ id: string }> => {
    try {
        const result = await pool.query(`
            DELETE FROM requests
            WHERE id = $1 
            RETURNING id
        `, [id]);

        return { id: result.rows[0].id };
    } catch (err: any) {
        console.error(err);
        throw new Error(err.message || "An unexpected error occurred");
    }
};

export const editRequest = async (id: string, description: string): Promise<{ id: string, description: string }> => {
    try {
        const result = await pool.query(`
            UPDATE requests
            SET description = $2
            WHERE id = $1
            RETURNING id, description
        `, [id, description]);

        return { id: result.rows[0].id, description: result.rows[0].description };
    } catch (err: any) {
        console.error(err);
        throw new Error(err.message || "An unexpected error occurred");
    }
};