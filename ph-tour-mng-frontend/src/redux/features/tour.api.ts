import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types/index.type";
import type { ITourPackage } from "@/types/tour.type";

export const tourApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Add a new tour type
        addTourType: builder.mutation({
            query: (tourType) => ({
                url: "/tour/create-tour-type",
                method: "POST",
                data: tourType,
            }),
            invalidatesTags: ["TOUR"],
        }),
        // Add a new tour
        addTour: builder.mutation({
            query: (tour) => ({
                url: "/tour/create",
                method: "POST",
                data: tour,
            }),
            invalidatesTags: ["TOUR"],
        }),
        // Get all tour types
        getTourTypes: builder.query({
            query: () => ({
                url: "/tour/tour-types",
                method: "GET"
            }),
            providesTags: ["TOUR"],
            transformResponse: (response) => response.data
        }),
        // Get all tours
        getAllTours: builder.query<ITourPackage[], unknown>({
            query: () => ({
                url: "/tour",
                method: "GET"
            }),
            providesTags: ["TOUR"],
            transformResponse: (
                response: IResponse<{ data: ITourPackage[] }>
            ) => response.data.data,
        }),
        // Delete a tour type
        deleteTourType: builder.mutation({
            query: (id) => ({
                url: `/tour/tour-types/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["TOUR"],
        }),
    }),
});

export const {
    useAddTourTypeMutation,
    useAddTourMutation,
    useGetTourTypesQuery,
    useGetAllToursQuery,
    useDeleteTourTypeMutation
} = tourApi;