import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = `${process.env.REACT_APP_API_URL}/promocode/`;

export const promocodeAPI = createApi({
  reducerPath: 'promoApi',
  baseQuery: fetchBaseQuery({baseUrl: API_URL}),
  tagTypes: ['Promo'],
  endpoints: (builder) => ({
    getPromoCodes: builder.query({
      query: () => '/get',
      providesTags: ['Promo']
    }),
    addPromoCode: builder.mutation({
      query: (promo) => ({
        url: '/create',
        method: 'POST',
        body: promo
      }),
      invalidatesTags: ['Promo']
    }),
    updatePromoCode: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/update/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Promo']
    }),
    deletePromoCode: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Promo']
    }),
    applyPromoCode: builder.mutation({
        query: (payload) => ({
          url: '/apply',
          method: 'POST',
          body: payload, 
        }),
      }),
  })
});

export const {
  useGetPromoCodesQuery,
  useAddPromoCodeMutation,
  useUpdatePromoCodeMutation,
  useDeletePromoCodeMutation,
    useApplyPromoCodeMutation,
} = promocodeAPI;
