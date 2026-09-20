import { userActions } from "./user-slice";
import { axiosInstance } from "../../utils/axios";

//signup
export const getSignupDetails = (user) => async(dispatch)=>{
    try{
        dispatch(userActions.getSignupRequest());
        const {data} = await axiosInstance.post("/v1/rent/user/signup", user);
        dispatch(userActions.getSignupDetails(data.user))
    }catch(error){
        const message = error.response?.data?.message || error.message;
        dispatch(userActions.getError(message));
    }
}

//login
export const getLogin=(user) => async(dispatch) =>{
    try{
        dispatch(userActions.getLoginRequest());
        const {data} = await axiosInstance.post("/v1/rent/user/login", user);
        dispatch(userActions.getLoginDetails(data.user))
    }catch(error){
        const message = error.response?.data?.message || error.message;
        dispatch(userActions.getError(message));
    }
}
    
export const currentUser =() => async(dispatch) =>{
    try{
        dispatch(userActions.getCurrentRequest());
        const {data}=await axiosInstance.get("/v1/rent/user/me");
        dispatch(userActions.getCurrentUser(data.user))
    }catch{
        dispatch(userActions.getLogout(null));
    }
}

export const updateUser = (updatedUser) => async(dispatch)=>{
    try{
        dispatch(userActions.getUpdateUserRequest());
        await axiosInstance.patch("/v1/rent/user/updateMe", updatedUser);
        const {data} = await axiosInstance.get("/v1/rent/user/me");
        dispatch(userActions.getCurrentUser(data.user));
    }catch(error){
        const message = error.response?.data?.message || error.message;
        dispatch(userActions.getError(message));
    }
}

export const forgotPassword = (email) => async(dispatch)=>{
    try{
        await axiosInstance.post("/v1/rent/user/forgotPassword",{email})   
    }catch(error){
        const message = error.response?.data?.message || error.message;
        dispatch(userActions.getError(message));
    }
}

export const resetPassword = (rePassword, token) => async(dispatch)=>{
    try{
        await axiosInstance.patch(`/v1/rent/user/resetPassword/${token}`, rePassword)
    }catch(error){
        const message = error.response?.data?.message || error.message;
        dispatch(userActions.getError(message));
    }
}

export const updatePassword =(password)=> async(dispatch)=>{
    try{
        dispatch(userActions.getPasswordRequest());
        await axiosInstance.patch("/v1/rent/user/updateMyPassword", password);
        dispatch(userActions.getPasswordSuccess(true)); 
    }catch(error){
        const message = error.response?.data?.message || error.message;
        dispatch(userActions.getError(message));
    }
}

export const logout = ()=> async(dispatch)=>{
    try{
        await axiosInstance.get("/v1/rent/user/logout")
        dispatch(userActions.getLogout(null));
    }catch(error){
        const message = error.response?.data?.message || error.message;
        dispatch(userActions.getError(message));
    }
}; 