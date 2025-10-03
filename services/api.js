import axios from 'axios';

// URL do backend hospedado no Render
const API_URL = 'https://agendai-backend-zd4p.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
});

