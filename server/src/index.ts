import express from 'express';
import dotenv from 'dotenv';
import router from './router';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();


const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
console.log(`CORS enabled for ${process.env.CLIENT_URL}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api",router)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
