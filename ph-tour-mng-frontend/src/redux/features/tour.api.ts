import { baseApi } from "@/redux/baseApi";

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
        // Get all tour types
        getTourTypes: builder.query({
            query: () => ({
                url: "/tour/tour-types",
                method: "GET"
            }),
            providesTags: ["TOUR"],
            transformResponse: (response) => response.data
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
    useGetTourTypesQuery,
    useDeleteTourTypeMutation
} = tourApi;