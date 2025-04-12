

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const API_URL = `${process.env.REACT_APP_API_URL}/api/categories/`;


export const categoryAPI = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL, 
  }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/get', 
    }),
    getCategoriesById: builder.query({
      query: (id) => `/get/${id}`,
    }),
    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: '/create',
        method: 'POST',
        body: newCategory,
      }),
    }),
    updateCategory: builder.mutation({
      query: (updatedCategory) => ({
        url: `update/${updatedCategory.id}`,
        method: 'PUT',
        body: updatedCategory,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `delete/${categoryId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryAPI;
