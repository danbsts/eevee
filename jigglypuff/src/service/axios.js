import axios from 'axios';

const baseURL = `http://${process.env.PONYTA ? process.env.PONYTA : "0.0.0.0"}:10077`;

const api = axios.create({
  baseURL,
});

export default api;