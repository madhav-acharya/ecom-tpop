import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = `${process.env.REACT_APP_API_URL}/api/favorite/`;

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
      const response = await axios.post(`${API_URL}/add`, {productId : (product?.productId?product?.productId:product?._id), name: product.name, price: product.sellingPrice, image: product.images[0]}, {
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

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (productId, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/remove`, productId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return productId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
