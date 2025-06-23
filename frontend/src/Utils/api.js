import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({
    baseURL: 'https://digitalcapsule-backend.onrender.com',
    withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const navigate = useNavigate();
      localStorage.removeItem("isLoggedIn");
      navigate('/auth');
    }
    return Promise.reject(error)
  },
)

export default api;