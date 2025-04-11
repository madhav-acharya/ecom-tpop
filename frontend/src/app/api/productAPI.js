import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productAPI = createApi({
  reducerPath: 'productAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api/products' }),
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
} = productAPI;
