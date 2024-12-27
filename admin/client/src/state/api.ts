import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ReactNode } from "react";

export interface Product {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface Order {
  token: string;
  orderId: string;
  products: OrderDetails[];
  totalCost: number;
}

interface OrderDetails {
  name: string;
  quantity: number;
  price: number;
}

export interface UpdateOrderStatusPayload {
  orderId: string;
}

export interface CurrentTokenPayload {
  token: string;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummarId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Orders"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    getPendingOrders: build.query<Order[], void>({
      query: () => "/orders/pending",
      providesTags: ["Orders"],
    }),
    getCompletedOrders: build.query<Order[], void>({
      query: () => "/orders/completed",
      providesTags: ["Orders"],
    }),
    updateOrderStatus: build.mutation<void, UpdateOrderStatusPayload>({
      query: (payload) => ({
        url: "/orders/update-status",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Orders"],
    }),
    getCurrentToken: build.query<string | null, void>({
      query: () => "/orders/current-token",
      providesTags: ["Orders"],
    }),
    setCurrentToken: build.mutation<void, CurrentTokenPayload>({
      query: (payload) => ({
        url: "/orders/current-token",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetPendingOrdersQuery,
  useGetCompletedOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetCurrentTokenQuery,
  useSetCurrentTokenMutation,
} = api;