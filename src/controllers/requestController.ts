import express from 'express';
import { Request, Response } from 'express';
import { Request as RequestType } from '../types/Request';
import jwt from 'jsonwebtoken'
import pool from '../config/db';
import * as userModel from '../models/userModel';
import * as requestModel from '../models/requestModel';

interface CreateRequestBody {
    user_email: string; // Email of the user making the request
    request: RequestType;
}

export const createRequest = async (req: Request<{}, {}, CreateRequestBody>, res: Response) => {
    try{
        const { user_email, request } = req.body;

        // Check if the request object is present
        if(!user_email){
            return res.status(400).json({ error: 'User email is required' });
        }

        if (!request) {
            return res.status(400).json({ error: 'Request object is required' });
        };
    
        const {
            request_type,
            from_city,
            to_city,
            parcel_type,
            dispatch_date,
            description,
        } = request;
    
        // Validate required fields
        if (!request_type || !from_city || !to_city || !dispatch_date || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
    
        // Validate request_type
        if (request_type !== 'order' && request_type !== 'delivery') {
            return res.status(400).json({ error: 'Invalid request type' });
        }
    
        // Validate parcel_type if request_type is 'order'
        if (request_type === 'order') {
            const validParcelTypes = ['Gadgets', 'Drinks', 'Clothes', 'Medicines', 'Other'];
            if (!validParcelTypes.includes(parcel_type as string)) {
                return res.status(400).json({ error: 'Invalid parcel type' });
            }
        }
    
        // Validate dispatch_date
        const dispatchDate = new Date(dispatch_date);
        if (isNaN(dispatchDate.getTime())) {
            return res.status(400).json({ error: 'Invalid dispatch date' });
        };
    
        let result;
        if (request_type === 'order') {
            result = await pool.query(`
                INSERT INTO requests (user_email, request_type, from_city, to_city, parcel_type, dispatch_date, description, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
                RETURNING *;
            `, [user_email, request_type, from_city, to_city, parcel_type, dispatchDate, description]);
        } else {
            result = await pool.query(`
                INSERT INTO requests (user_email, request_type, from_city, to_city, dispatch_date, description, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                RETURNING *;
            `, [user_email, request_type, from_city, to_city, dispatchDate, description]);
        }

        if (result.rowCount === 0) {
            throw new Error('Error occurred trying to create request');
        }

        return res.status(201).json({ request: result.rows[0] });
    } catch (err) {
        console.error('Error creating request:', err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Something went wrong' });
    }
};

export const getRequests = async (req: Request, res: Response) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token is not provided" });
        }

        const token = authHeader.split(" ")[1];

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'your secret key') as { email: string };
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: "Token expired" });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: "Invalid token" });
            } else {
                return res.status(500).json({ error: "Token verification failed" });
            }
        }

        const email = decoded.email;

        // Check if the user exists
        const existingUser = await userModel.getUserByEmail(email);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the user's requests
        const requestsResult = await requestModel.getRequests(existingUser.email);

        // Send the response with the requests
        return res.status(200).json({ requests: requestsResult });
    } catch (err) {
        console.error('Error getting requests:', err);
        return res.status(500).json({ error: err instanceof Error ? err.message : 'Something went wrong' });
    }
};