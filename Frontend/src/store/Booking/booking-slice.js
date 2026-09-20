// managing booking 

// store all booking
// store individual booking detials
// track the api loading status
// Add new booking when a booking is created
//updating the booking data when we recv it from the backend


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    booking: [],
    bookingDetails: {},
    loading: false
}

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setBookingRequest(state) {
            state.loading = true;
        },
        //stores the bookings recv from the api
        setBookings(state, action) {
            state.booking = action.payload;
            state.loading = false;
        },
        addBooking: (state, action) => {
            state.booking.push(action.payload);
        },
        setBookingDetails: (state, action) => {
            state.bookingDetails = action.payload.bookings || action.payload;
        }        
    }
})

export const { setBookingRequest, setBookings, addBooking, setBookingDetails } = bookingSlice.actions;
export default bookingSlice;