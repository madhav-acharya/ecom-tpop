import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';


const API_URL = `${process.env.REACT_APP_API_URL}/api/users/`;


const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const isOnAuthPage = ['/login', '/signup'].includes(window.location.pathname);

  if (result.error?.status === 401 && !isOnAuthPage) {
    console.log('Unauthorized! Redirecting to login...');
    localStorage.clear();
    toast.error('Session expired. Please log in again.');
    window.location.href = '/login';
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
      query: () => '/get/me',
      providesTags: ['User'],
    }),
    updateImageById: builder.mutation({
      query: ({ id, imageFormData }) => ({
        url: `update/image/${id}`,
        method: 'PUT',
        body: imageFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['User'],
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
    console.log("userData",userData)
    const { data } = await axios.post(`${API_URL}/signup`, userData);
    console.log("data",data)
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

export const updateImage = async ({id, imageFormData}) => {
  try
  {
    const response = await axios.put(
        `${API_URL}/update/image/${id}`,
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


