import express from 'express';
import dotenv from 'dotenv';
import router from './router';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Multi-origin CORS support
const allowedOrigins = [
  'http://localhost:5173',                         
  'https://2mbqcshr-5173.inc1.devtunnels.ms',      
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

console.log('CORS allowed for:', allowedOrigins.join(', '));

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api", router);

// ✅ Server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
