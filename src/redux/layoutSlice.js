import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  icon: 'faUser', // 👈 chỉ lưu key
  title: 'default',
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setLayoutData: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export default layoutSlice.reducer;
export const { setLayoutData } = layoutSlice.actions;
