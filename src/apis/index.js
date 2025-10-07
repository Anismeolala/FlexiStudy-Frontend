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

      export const logOutAPI = async () => {
        const response = await api.post('auth/logout', { token: localStorage.getItem('accessToken') });
        return response.data;
    }

     export const refreshTokenAPI = async (oldToken) => {
        const res = await api.post("auth/refresh", { token: oldToken });
        return res.data;
      };

  //  - User API -
      export const updateUserAPI = async (id, payload) => {
          const res = await api.put(`users/${id}`, payload);
          console.log("updateUserAPI -> res", res); 
          return res.data;
          };

      export const createUserAPI = async (payload) => {
        const res = await api.post("users", payload);
        return res.data;
      };

      export const deleteUserAPI = async (id) => {
        const res = await api.delete(`users/${id}`);
        return res.data;
      };

      export const getAllUsersAPI = async (paramsOrPage = 1, size = 10, extra = {}) => {
        const params =
          typeof paramsOrPage === "object"
            ? paramsOrPage
            : { page: paramsOrPage, size, ...extra };

        const res = await api.get("users", { params });
        return res.data; // { code, result }
      };

  // - Company API -
      export const createCompanyAPI = async (payload) => {
        const res = await api.post("companies", payload);
        return res.data;
      };

      export const getAllCompaniesAPI = async ({ page = 1, size = 10, search = '' }) => {
        const res = await api.get(`/companies`, {
          params: { page, size }, 
        });
        return res.data;
      };

      export const getCompanyByIdAPI = async (companyId) => {
        const res = await api.get(`companies/${companyId}`);
        return res.data;
      };

      export const updateCompanyAPI = async (companyId, payload) => {
        const res = await api.put(`companies/${companyId}`, payload);
        return res.data;
      };

      export const deleteCompanyAPI = async (companyId) => {
        const res = await api.delete(`companies/${companyId}`);
        return res.data;
      };

      export const getJobsByCompanyAPI = async (companyId) => {
        const res = await api.get(`companies/jobs/${companyId}`);
        return res.data;
      };

      export const uploadCompanyLogoAPI = async (companyId, file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post(`companies/upload-logo/${companyId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return res.data;
      };


      //  - Image API -
      // export const uploadAvatarAPI = async (image) => {
      //   const res = await api.post("uploads/users", image);
      //   return res.data;
      // };


