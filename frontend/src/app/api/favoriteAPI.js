import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const API_URL = `${process.env.REACT_APP_API_URL}/favorite/`;

const notifyerror = (msg) => {
  toast.dismiss();
  toast.error(msg);
};
const notifysuccess = (msg) => {
  toast.dismiss();
  toast.success(msg);
};

const token = localStorage.getItem('token');

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
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

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (product, { rejectWithValue }) => {
    try {
      console.log("product in favorite",product)
      const response = await axios.post(`${API_URL}/add`, {productId : (product?.productId?product?.productId:product?._id), customShipping: product?.customShipping,  defaultShipping: product?.defaultShipping, name: product.name, price: product.sellingPrice, image: product.images[0]}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notifysuccess('Product added to favorites');
      return response.data;
    } catch (error) {
      notifyerror(error?.response?.data?.message || 'Failed to add product to favorites');
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (productId, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/remove`, productId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notifysuccess('Product removed from favorites');
      return productId;
    } catch (error) {
      notifyerror(error?.response?.data?.message || 'Failed to remove product from favorites');
      return rejectWithValue(error.response.data);
    }
  }
);
