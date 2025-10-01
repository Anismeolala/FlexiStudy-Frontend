import api from "../services/api";   

 //  - Auth API -
      export const loginAPI = async (username, password) => {
        const res = await api.post("auth/token", { username, password });
        return res.data;
      };

      export const getMyInfoAPI = async () => {
        const res = await api.get("users/myInfo");
        return res.data;
      };

      export const fetchLogoutAPI = async () => {
        const response = await api.post('auth/logout', { token: localStorage.getItem('accessToken') });
        return response.data;
    }
