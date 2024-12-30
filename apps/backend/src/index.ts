import express, { 
  Application, 
  Request, 
  Response, 
  NextFunction, 
  ErrorRequestHandler, 
  RequestHandler
} from 'express'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { jwtVerify } from '@kinde-oss/kinde-node-express';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Access Control Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Ensure the correct issuer is used in jwtVerify
const jwtVerifier: RequestHandler = async (req, res, next) => {
  try {
    await jwtVerify("https://sahil05.kinde.com", {
      audience: "", // Optional: set your audience if needed
    })(req, res, () => {
      console.log("Token is valid"); // Log success message when token is valid
      next(); // Proceed to the next middleware or route handler
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Token validation failed:", err.message); // Safely access the error message
    } else {
      console.error("Token validation failed with an unknown error."); // Handle non-Error objects
    }
    next(err); // Pass the error to the error handler
  }
};

// Routes
app.get("/", (req, res) => {
  res.send("API is running!");
});

app.get("/api/protected", jwtVerifier, (req: Request, res: Response) => { 
  res.json({
    message: "This is protected media data",
  });
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => { 
  console.error(err.message);
  res.status(403).json({ error: err.message });
};

app.use(errorHandler); 

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;