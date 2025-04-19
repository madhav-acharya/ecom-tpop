import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

const API_URL = `${process.env.REACT_APP_API_URL}/admin`;
const notifyerror = (msg) => {
  toast.dismiss();
  toast.error(msg);
};
const notifysuccess = (msg) => {
  toast.dismiss();
  toast.success(msg);
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const isOnAuthPage = ['/login', '/signup'].includes(window.location.pathname);

  if (result.error?.status === 401 && !isOnAuthPage) {
    console.log('Unauthorized! Redirecting to login...');
    localStorage.clear();
    notifyerror('Session expired. Please log in again.');
    window.location.href = '/';
  }

  return result;
};

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getDashboardStats: builder.query({
      query: () => '/dashboard-stats'
    }),
    getDailySalesOverview: builder.query({
      query: () => '/sales/daily'
    }),
    getWeeklySalesOverview: builder.query({
      query: () => '/sales/weekly'
    }),
    getMonthlySalesOverview: builder.query({
      query: () => '/sales/monthly'
    }),
    getHourlySalesOverview: builder.query({
      query: () => '/sales/hourly'
    }),
    getMinutelySalesOverview: builder.query({
      query: () => '/sales/minutely'
    }),
    getProductCategories: builder.query({
      query: () => '/product-categories'
    }),
    getOrderStatusSummary: builder.query({
      query: () => '/order-status-summary'
    }),
    getRecentOrders: builder.query({
      query: () => '/recent-orders'
    }),
  }),
});

export const { useAdminLoginMutation, 
  useGetDashboardStatsQuery,
  useGetHourlySalesOverviewQuery,
  useGetMinutelySalesOverviewQuery,
  useGetDailySalesOverviewQuery,
  useGetWeeklySalesOverviewQuery,
  useGetMonthlySalesOverviewQuery,
  useGetProductCategoriesQuery,
  useGetOrderStatusSummaryQuery,
  useGetRecentOrdersQuery } = adminApi;
