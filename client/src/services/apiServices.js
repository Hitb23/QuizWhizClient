import axios from 'axios';

const API_URL = 'http://localhost:7234/api';

export const getTestMessage = async () => {
    try {
        console.log(`${API_URL}/test/get`);
        const response = await axios.get(`${API_URL}/Test/get`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching test message', error);
        throw error;
    }
};
