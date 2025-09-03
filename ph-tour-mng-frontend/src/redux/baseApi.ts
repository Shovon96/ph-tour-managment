import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axios.base.query";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: ["USERS", "TOUR", "DIVISION", "BOOKING"],
});