import axios from 'axios';
7234
const API_URL = 'http://192.168.1.20:8002/api';

export default axios.create ({
    baseURL: API_URL,
});