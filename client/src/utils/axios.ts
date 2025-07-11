// src/utils/axios.ts or in your main.tsx
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000"; // or your backend URL

export default axios;
