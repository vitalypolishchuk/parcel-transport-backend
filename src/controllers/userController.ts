import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel';

export const getUser = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
  
        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }
  
        // Extract token from "Bearer <token>" format
        const token = authHeader.split(' ')[1];
  
        if (!token) {
            return res.status(401).json({ error: "Token is malformed" });
        }
  
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { email: string };
  
        // Fetch user from database based on email in token
        const existingUser = await userModel.getUserByEmail(decoded.email);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
  
        // Return user data
        return res.status(200).json({ email: existingUser.email, created_at: existingUser.created_at });
  
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: err.message || "An unexpected error occurred" });
    }
  };