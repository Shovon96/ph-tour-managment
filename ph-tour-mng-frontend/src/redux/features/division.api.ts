import { baseApi } from "@/redux/baseApi";

export const divisionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Add a new Division
        addDivision: builder.mutation({
            query: (division) => ({
                url: "/division/create",
                method: "POST",
                data: division,
            }),
            invalidatesTags: ["DIVISION"],
        }),
        // Get all Divisions
        getDivisions: builder.query({
            query: () => ({
                url: "/division",
                method: "GET"
            }),
            providesTags: ["DIVISION"],
            transformResponse: (response) => response.data
        }),
        // Delete a Division
        deleteDivision: builder.mutation({
            query: (id) => ({
                url: `/division/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["DIVISION"],
        }),
    }),
});

export const {
    useAddDivisionMutation,
    useGetDivisionsQuery,
    useDeleteDivisionMutation
} = divisionApi;