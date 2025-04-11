// src/features/api/orderApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api/orders/' }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => 'get',
      providesTags: ['Order']
    }),
    getOrderById: builder.query({
      query: (id) => `get/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }]
    }),
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: 'create',
        method: 'POST',
        body: newOrder
      }),
      invalidatesTags: ['Order']
    }),
    updateOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `update/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }]
    })
  })
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation
} = orderApi;
