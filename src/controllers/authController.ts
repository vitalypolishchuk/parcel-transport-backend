import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const users: {
  email: string;
  password: string
}[] = []; // Replace with a proper database

export const register = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    // Check if user already exists
    const isUserExist = users.find((user) => user.email === email);
    if (isUserExist) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Add the new user to the mock database (users array)
    users.push({ email, password: hashedPassword });

    // Respond with a success message and a 201 status code
    console.log(`Email: ${email}, password: ${password} was successfully registered!`)
    res.status(200).json({ status: "successful" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const login = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find the user by email
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(404).json({ error: "User with given email is not found" });
    }

    // Compare the provided password with the hashed password
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'your secret key', { expiresIn: '1h' });

    console.log(`Email: ${email}, password: ${password} was successfully logged in!`)
    res.status(200).json({ token });

  } catch (err: any) {
    console.error(err);  // Logging the error for debugging
    return res.status(500).json({ error: err.message });
  }
};

export const validate = (req: Request, res: Response) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(404).json({ error: "Token is undefined" });
    }

    // Verify and decode the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your secret key');
    const userEmail = decoded.email;

    // Find the user based on the email from the token
    const user = users.find(user => user.email === userEmail);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with user data or a success message
    return res.status(200).json(user);
    
  } catch (err: any) {
    console.error(err);  // Logging the error for debugging
    return res.status(500).json({ error: err.message });
  }
};

// put /user to userController.ts
export const user = (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Token is malformed" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { email: string };

    // Fetch user from database based on email in token
    const user = users.find((user) => user.email === decoded.email);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Return user data
    return res.status(200).json({ email: user.email, requests: 0 });

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};