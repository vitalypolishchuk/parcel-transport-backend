import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import requestRoutes from './routes/requestRoutes';
import cookieParser from 'cookie-parser';

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent and received
}));
app.use(express.json());
app.use(cookieParser())
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/request', requestRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
