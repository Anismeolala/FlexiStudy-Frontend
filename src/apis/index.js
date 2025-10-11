import api from "../services/api";   

 //  - Auth API -
      export const loginAPI = async (username, password) => {
        const res = await api.post("auth/token", { username, password });
        return res.data;
      };

      export const registerAPI = async (username, password) => {
        const res = await api.post("users/register", { username, password });
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
      export const onboardAPI = async (payload) => {
        const res = await api.post("profile", payload);
        return res.data;
      };

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
        return res.data;
      };

      // apis/userApi.js
      export const uploadAvatarAPI = (userId, formData) => {
        return api.post(`users/avatar/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      };

  // - Company API -
      export const createCompanyAPI = async (payload) => {
        const res = await api.post("companies", payload);
        return res.data;
      };

      export const getAllCompaniesAPI = async ({ page = 1, size = 10, search = '' }) => {
        const res = await api.get(`/companies`, {
          params: {
            page,
            size,
            ...(search && { search }),  
          },
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

      export const uploadCompanyLogoAPI = (companyId, formData) => {
        return api.post(`companies/upload-logo/${companyId}`, formData);
      };

    //  - Job API -

      // Lấy danh sách Job (phân trang + search)
      export const getAllJobsAPI = async ({ page = 1, size = 10, search = '', city, urgent }) => {
        const res = await api.get(`jobs`, {
          params: {
            page,
            size,
            ...(search && { search }),city, urgent // chỉ truyền search nếu có
          },
        });
        return res.data;
      };

      // Lấy danh sách job trong 30 ngày gần nhất (phân trang)
      export const getRecentJobsAPI = async ({ page = 1, size = 8, search = '', city = '' }) => {
        const res = await api.get(`jobs`, {
          params: { page, size, ...(search && { search }), city },
        });
        return res.data;
      };


      // Lấy chi tiết 1 Job
      export const getJobByIdAPI = async (jobId) => {
        const res = await api.get(`jobs/${jobId}`);
        return res.data;
      };

      // Tạo mới Job
      export const createJobAPI = async (payload) => {
        const res = await api.post(`jobs`, payload);
        return res.data;
      };

      // Cập nhật Job
      export const updateJobAPI = async (jobId, payload) => {
        const res = await api.put(`jobs/${jobId}`, payload);
        return res.data;
      };

      // Xóa Job
      export const deleteJobAPI = async (jobId) => {
        const res = await api.delete(`jobs/${jobId}`);
        return res.data;
      };

    export const getJobCategoriesAPI = async () => {
      const res = await api.get(`jobs/categories`);
      return res.data;
    };


      // - SKill API -
      export const suggestSkillAPI = async (keyword) => {
        const res = await api.get(`skills/suggest?keyword=${encodeURIComponent(keyword)}`);
        return res.data;
      };
      




