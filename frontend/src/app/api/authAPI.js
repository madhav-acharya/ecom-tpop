import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';


const API_URL = "http://localhost:3001/api/users";
const token = localStorage.getItem("token");

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && (window.location.pathname !== '/login' && window.location.pathname !== '/signup')) {
    console.log('Unauthorized! Redirecting to login...');
    localStorage.clear();
    window.location.href = '/login';
    toast.error('Session expired. Please log in again.');
  }

  return result;
};

export const authAPI = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => '/get',
    }),
    getUserById: builder.query({
      query: (id) => `/get/${id}`,
    }),
    getCurrentUser: builder.query({
      query: () => 'get/me',
      providesTags: ['User'],
    }),
    updateUserById: builder.mutation({
      query: ({ id, userData }) => ({
        url: `update/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUserById: builder.mutation({
      query: (id) => ({
        url: `delete/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});


export const signup = createAsyncThunk('user/signup', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/signup`, userData);
    return data;
  } catch (error) {
    console.log("Error Occured while registering user");
    return rejectWithValue(error.response.data.message);
  }
});

export const login = createAsyncThunk('user/login', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, userData);
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    console.log("Error Occured while logging in");
    return rejectWithValue(error.response.data.message);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.clear();
  window.location.href = "/login";
});

export const updateImage = async ({userId, imageFormData}) => {
  try
  {
    const response = await axios.put(
        `http://localhost:3001/api/users/update/image/${userId}`,
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
  }
  catch ( error)
  {
    console.log("error occurred uploading photo")
    throw error;
  }
}

export const { useGetAllUsersQuery, useGetUserByIdQuery, useGetCurrentUserQuery, useUpdateUserByIdMutation, useDeleteUserByIdMutation } = authAPI;


