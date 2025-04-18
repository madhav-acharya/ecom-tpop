import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = `${process.env.REACT_APP_API_URL}/products/`;


export const productAPI = createApi({
  reducerPath: 'productAPI',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/get',
    }),
    getProductById: builder.query({
      query: (id) => `/get/${id}`,
    }),
    addProduct: builder.mutation({
      query: (formData) => ({
        url: '/add',
        method: 'POST',
        body: formData,
      }),
    }),
    uploadProducts: builder.mutation({
      query: (product) => ({
        url: '/upload',
        method: 'POST',
        body: product,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, product }) => ({
        url: `/update/${id}`,
        method: 'PUT',
        body: product,
      }),
    }),
    updateProductQuantity: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/update-quantity/${id}`,
        method: 'PUT',
        body: { quantity },
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateProductQuantityMutation,
} = productAPI;
