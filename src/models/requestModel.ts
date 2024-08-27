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