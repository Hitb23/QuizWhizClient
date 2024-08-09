import axios from 'axios';
7234
const API_URL = 'http://localhost:7234/api';

export default axios.create ({
    baseURL: API_URL,
});