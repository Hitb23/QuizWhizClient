import axios from 'axios';

const API_URL = 'https://localhost:44361/api';

export default axios.create ({
    baseURL: API_URL,
});