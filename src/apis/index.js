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

      export const createPasswordAPI = async (password) => {
        const res = await api.post("users/create-password", { password });
        return res.data;
      }

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

     export const getAllJobsAPI = async (params) => {
        const res = await api.get('jobs', { params });
        return res.data;
      };

      export const getAllJobsAdminAPI = async (params) => {
          const res = await api.get(`jobs/admin`, { params });
          return res.data;
        };

      // Lấy danh sách job trong 30 ngày gần nhất (phân trang)
      export const getRecentJobsAPI = async ({ page = 1, size = 8, search = '', city = '' }) => {
        const res = await api.get(`jobs`, {
          params: { page, size, ...(search && { search }), city },
        });
        return res.data;
      };

      //  Lấy danh sách job theo category
      export const getJobsByCategoryAPI = async (params) => {
        const res = await api.get(`jobs/by-category`, { params });
        return res.data;
      };


      export const getJobByIdAPI = async (jobId) => {
        const res = await api.get(`jobs/${jobId}`);
        return res.data;
      };

      export const createJobAPI = async (payload) => {
        const res = await api.post(`jobs`, payload);
        return res.data;
      };

      export const updateJobAPI = async (jobId, payload) => {
        const res = await api.put(`jobs/${jobId}`, payload);
        return res.data;
      };

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

      // - Application API -
      export const uploadCvAPI = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post("uploads/cv", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data; // { result: "cvUrl", message: "CV uploaded successfully" }
      };
      export const getApplicationsByUserAPI = async (userId) => {
          const res = await api.get(`applications/user/${userId}`);
          return res.data.result;
        };
      // Tạo Application (nộp hồ sơ)
      export const createApplicationAPI = async (payload) => {
        const res = await api.post("applications", payload);
        return res.data; // { result: ApplicationResponse }
      };

      // - Saved Job API -
      export const checkSavedJobAPI = async (jobId) => {
        const res = await api.get(`saved-job/check/${jobId}`);
        return res.data.result; // true hoặc false
      };

      // Lưu job
      export const saveJobAPI = async (jobId) => {
        const res = await api.post(`saved-job/${jobId}`);
        return res.data;
      };

      // Bỏ lưu job
      export const unsaveJobAPI = async (jobId) => {
        const res = await api.delete(`saved-job/${jobId}`);
        return res.data;
      };

      // Lấy danh sách job đã lưu
      export const getSavedJobsAPI = async () => {
        const res = await api.get("saved-job");

        let data = res.data;
        // Nếu là string -> parse lại thành object
        if (typeof data === "string") {
          data = JSON.parse(data);
        }

        return data.result || [];
       };

      // - Profile API -
      export const getMyProfileAPI = async () => {
        const res = await api.get("profile/me");
        return res.data;
      };

      export const updateMyProfileAPI = async (payload) => {
        const res = await api.put("profile/me", payload);
        return res.data;
      };





