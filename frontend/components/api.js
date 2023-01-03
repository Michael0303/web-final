import axios from 'axios';

const API_ROOT = process.env.NODE_ENV === "production" ? "https://backend-production-f644.up.railway.app/" : "http://localhost:4000/"


const instance = axios.create({
    baseURL: API_ROOT,
    withCredentials: true,
});

export default instance;

// instance.get('/hi').then((data) => console.log(data));
