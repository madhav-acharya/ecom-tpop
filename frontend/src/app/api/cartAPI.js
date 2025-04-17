import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

const API_URL = `${process.env.REACT_APP_API_URL}/cart/`;

const notifyerror = (msg) => {
  toast.dismiss();
  toast.error(msg);
};
const notifysuccess = (msg) => {
  toast.dismiss();
  toast.success(msg);
};

const token = localStorage.getItem('token');

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/add`, {productId : product?.productId?product?.productId:product?._id, customShipping: product?.customShipping, defaultShipping: product?.defaultShipping, name: product?.name, price: product?.sellingPrice?product?.sellingPrice:product?.price, image: product.images?.[0], quantity: 1}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notifysuccess('Product added to cart');
      return response?.data;
    } catch (error) {
      notifyerror(error?.response?.data?.message || 'Failed to add product to cart');
      console.log("error in cart",error)
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/update/${productId}`, { quantity }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      notifysuccess('Cart item updated successfully');
      return response.data;
    } catch (error) {
      notifyerror(error?.response?.data?.message || 'Failed to update cart item');
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notifysuccess('Product removed from cart');
      return response.data;
    } catch (error) {
      notifyerror(error?.response?.data?.message || 'Failed to remove product from cart');
      return rejectWithValue(error.response.data);
    }
  }
);

export const cartAPI = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    removeUsersCart: builder.mutation({
      query: (userID) => ({
        url: '/remove',
        method: 'DELETE',
        userID,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const { useRemoveUsersCartMutation } = cartAPI;