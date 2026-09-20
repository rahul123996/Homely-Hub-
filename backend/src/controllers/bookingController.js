import { Property } from "../Models/propertyModel.js";
import {Booking} from "../Models/bookingModel.js";

//createOrder : booking any property
const createOrder = async(req,res)=>{
    try {
        const {amount, propertyId, fromdate, fromDate, toDate, guests} = req.body;
        const finalFromDate = fromDate || fromdate;

        //orderID : order_1761878400000
        const orderId = "order_" + Date.now();
        
        res.json({
            success:true,
            message: "Order created Successfully",
            orderId,
            amount,
            propertyId,
            fromDate: finalFromDate,
            toDate,
            guests
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


//verifyPayment
// 25 ,26
//1. save the booling
//2. Block these dates

const verifyPayment = async(req,res) =>{
    try {
        const{orderId, bookingDetails, forceStatus} = req.body;

        if(forceStatus ==="success"){
            if (!bookingDetails) {
                return res.status(400).json({
                    success: false,
                    message: "Booking details are required"
                });
            }

            const paymentId = "pay_" + Date.now();

            const nightsVal = bookingDetails.nights || bookingDetails.numberOfnights || bookingDetails.numberofnights || 1;
            const newBooking = await Booking.create({
                user: req.user._id,
                property: bookingDetails.propertyId,
                price: bookingDetails.price,
                fromDate: bookingDetails.fromDate || bookingDetails.fromdate,
                toDate: bookingDetails.toDate,
                guests: bookingDetails.guests,
                numberofnights: nightsVal,
                numberOfnights: nightsVal,
                paid: true
            });

            //tell property those dates are taken

            const updatedproperty =await Property.findByIdAndUpdate(
                bookingDetails.propertyId,{
                    $push:{
                        currentBookings:{
                            bookingId:newBooking._id,
                            fromDate:newBooking.fromDate,
                            toDate:newBooking.toDate,
                            userId:newBooking.user
                        }
                    }
                },
                {returnDocument: 'after'}
            );

            res.json({
                success:true,
                message:"Payment successfull, booking confirmed!!",
                paymentId,
                newBooking
            });
        }else{
            res.status(400).json({
                success:false,
                message:"Payment failed!!",
                orderId
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


//get my bookings
const getUserBookings = async(req,res)=>{
    try{
        const bookings = await Booking.find({user:req.user._id});

        res.status(200).json({
            status:"success",
            data:{
                bookings
            }
        })

    }catch(error){
        res.status(401).json({
            status:"fail",
            message:error.message
        })
    }
}

//get one booking detils
// /:id
const getBookingDetails = async(req,res)=>{
    try{
        const bookings = await Booking.findById(req.params.bookingId);

        
        res.status(200).json({
            status:"success",
            data:{
                bookings
            }
        })

    }catch(error){
        res.status(401).json({
            status:"fail",
            message:error.message   
        })
    }
}


export {getBookingDetails,getUserBookings,createOrder,verifyPayment}