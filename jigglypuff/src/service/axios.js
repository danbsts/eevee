import axios from 'axios';

const baseURL = `http://${process.env.PONYTA ? process.env.PONYTA : "127.0.0.1"}:10077`;

const api = axios.create({
  baseURL,
});

export default api;