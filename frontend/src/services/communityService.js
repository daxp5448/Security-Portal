import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const communityService = {
    getPosts: async () => {
        const response = await axios.get(`${API_URL}/community/posts`);
        return response.data;
    },
    createPost: async (postData) => {
        const response = await axios.post(`${API_URL}/community/posts`, postData, getAuthHeader());
        return response.data;
    },
    deletePost: async (id) => {
        const response = await axios.delete(`${API_URL}/community/posts/${id}`, getAuthHeader());
        return response.data;
    },
    likePost: async (id) => {
        const response = await axios.put(`${API_URL}/community/posts/${id}/like`, {}, getAuthHeader());
        return response.data;
    },
    replyToPost: async (id, replyData) => {
        const response = await axios.post(`${API_URL}/community/posts/${id}/reply`, replyData, getAuthHeader());
        return response.data;
    }
};
