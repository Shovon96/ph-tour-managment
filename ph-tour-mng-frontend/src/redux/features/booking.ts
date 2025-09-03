import { baseApi } from "@/redux/baseApi";

export const tourApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create a new booking
        createBooking: builder.mutation({
            query: (bookingData) => ({
                url: "/booking",
                method: "POST",
                data: bookingData,
            }),
            invalidatesTags: ["BOOKING"],
        }),
    }),
});

export const {
    useCreateBookingMutation
} = tourApi;