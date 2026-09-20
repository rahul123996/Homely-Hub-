import {axiosInstance} from "../../utils/axios"
import { setBookingRequest, setBookingDetails, setBookings } from "./booking-slice"

//fetch booking details
export const fetchBookingDetails =(bookingId) => async(dispatch)=>{
    try{
        dispatch(setBookingRequest());
        const response = await axiosInstance.get(`/v1/rent/user/booking/${bookingId}`);
        dispatch(setBookingDetails(response.data.data));
    }catch(error){
        console.error("Error fetch booking details", error)
    }
} 

//fetchuser bookings

export const fetchuserBookings = () => async (dispatch)=>{
    try{
        dispatch(setBookingRequest());
        const response = await axiosInstance.get("/v1/rent/user/booking")
        dispatch(setBookings(response.data.data.bookings))

    }catch(error){
        console.error("Error fetching  booking", error)

    }
}