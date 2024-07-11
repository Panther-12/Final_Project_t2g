import express, { Request, Response } from 'express';
import cors from 'cors';
import { testDatabaseConnection } from './utils/dbUtils';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import venueRoutes from './routes/venueRoutes';
import registrationRoutes from './routes/registrationRoutes';
import eventRoutes from './routes/eventRoutes';

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Routes
app.use('/users', userRoutes);
app.use('/venues', venueRoutes)
app.use('/registration', registrationRoutes)
app.use('/events', eventRoutes)

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


// Test database connection on server start
testDatabaseConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
  });

testDatabaseConnection()