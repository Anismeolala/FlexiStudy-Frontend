import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyInfoAPI } from '../apis';


// Async action to fetch user profile data
export const getMyInfo = createAsyncThunk('users/myInfo', async () => {
  const response = await getMyInfoAPI();
  return response;
});


// Define the initial state
 const initialState = {
    isAuthorized: !!localStorage.getItem("accessToken"),
    id: null,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    fullName: '',
    phone: '',
    avatarUrl: '',
    address: '',
    role: '',
    profile_completed: false,
    permissions: [],
    isLoading: false,  
    isError: false,
    };


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUser: () => {
            return initialState;
        },
        setIsAuthorized: (state, action) => {
            state.isAuthorized = action.payload;
          },
        setUser: (state, action) => {
            Object.assign(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMyInfo.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMyInfo.fulfilled, (state, action) => {
            const userData = action.payload?.result;
            if (!userData) {
                state.isAuthorized = false;
                state.isLoading = false;
                return;
            }
            state.id = userData.id;
            state.username = userData.username;
            state.email = userData.email;
            state.firstName = userData.firstName;
            state.lastName = userData.lastName;
            state.fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
            state.phone = userData.phone;
            state.avatarUrl = userData.avatarUrl;
            state.address = userData.address;
            state.profile_completed = userData.profile_completed;
            state.companyName = userData.companyName;
            state.companyId = userData.companyId;
            state.isAuthorized = true;
            state.role = userData.roles?.[0]?.name || null;
            state.profile_completed = userData.profileCompleted;
            state.permissions = userData.roles?.flatMap(r => r.permissions?.map(p => p.name)) || [];
            state.isLoading = false;
            state.isError = false;
            });
        builder.addCase(getMyInfo.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
            state.isAuthorized = true;
        });
    },
});

export default userSlice.reducer;
export const { resetUser, setUser, setIsAuthorized } = userSlice.actions;
