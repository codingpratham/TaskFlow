import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './router';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'https://task-flow-nu-two.vercel.app',
    credentials: true,
  })
);

app.options("*", cors())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", router);

app.get("/", (req:Request, res:Response) => {
  res.send("Welcome to the backend server!"); 
})


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
