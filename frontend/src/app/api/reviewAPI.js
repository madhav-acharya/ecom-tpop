import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = `${process.env.REACT_APP_API_URL}/api/reviews/`;


export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    getAllReviews: builder.query({
      query: () => '/get',
      providesTags: ['Review']
    }),
    createReview: builder.mutation({
      query: (review) => ({
        url: '/create',
        method: 'POST',
        body: review
      }),
      invalidatesTags: ['Review']
    }),
    updateReview: builder.mutation({
      query: ({ id, review }) => ({
        url: `/update/${id}`,
        method: 'PUT',
        body: review
      }),
      invalidatesTags: ['Review']
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Review']
    }),
    getReviewById: builder.query({
      query: (id) => `/get/${id}`,
      providesTags: ['Review']
    }),
    getReviewsByProductId: builder.query({
      query: (productId) => `/get/product/${productId}`,
      providesTags: ['Review']
    })
  })
});

export const {
  useGetAllReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
    useGetReviewByIdQuery,
    useGetReviewsByProductIdQuery
} = reviewApi;
