import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as userModel from '../models/userModel';

export const register = async (req: Request, res: Response) => { 
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Check if user already exists
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Add the new user to the database
        await userModel.addUser(email, hashedPassword);

        res.status(201).json({ status: "successful" });
    } catch (err: any) {
        console.error('Register error:', err.message);
        return res.status(500).json({ error: err.message || "An unexpected error occurred" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find the user by email
        const existingUser = await userModel.getUserByEmail(email);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided password with the hashed password
        if (!bcrypt.compareSync(password, existingUser.password_hash)) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign({ email: existingUser.email, id: existingUser.id }, process.env.JWT_SECRET || 'your secret key', { expiresIn: '1h' });

        // Respond with the token
        res.status(200).json({ token });

    } catch (err: any) {
        console.error('Login error:', err.message);
        return res.status(500).json({ error: err.message || "An unexpected error occurred" });
    }
};

export const validate = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.authToken;

        if (!token) {
            return res.status(401).json({ error: "Token is missing" });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your secret key') as { email: string };
        const email = decoded.email;

        // Find the user based on the email from the token
        const existingUser = await userModel.getUserByEmail(email);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with user data or a success message
        return res.status(200).json({ email: existingUser.email });

    } catch (err: any) {
        console.error('Validate error:', err.message);
        return res.status(500).json({ error: err.message || "An unexpected error occurred" });
    }
};