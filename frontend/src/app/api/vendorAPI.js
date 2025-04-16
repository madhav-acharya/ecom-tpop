

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const API_URL = `${process.env.REACT_APP_API_URL}/vendors`;


export const vendorAPI = createApi({
  reducerPath: 'vendorApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL, 
  }),
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: () => '/get', 
    }),
    getVendorsById: builder.query({
      query: (id) => `/get/${id}`,
    }),
    addVendor: builder.mutation({
      query: (newVendor) => ({
        url: '/create',
        method: 'POST',
        body: newVendor,
      }),
    }),
    updateVendor: builder.mutation({
      query: (updatedVendor) => ({
        url: `update/${updatedVendor.id}`,
        method: 'PUT',
        body: updatedVendor,
      }),
    }),
    deleteVendor: builder.mutation({
      query: (vendorId) => ({
        url: `delete/${vendorId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorAPI;
