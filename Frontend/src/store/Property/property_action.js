import { propertyAction } from "./property_slice";
import { axiosInstance } from "../../utils/axios";

// get all properties
//1. start api req
//2. tell redux loading started
//3. Get search parameters
//4. call backend api
//5. wait for response
//6. Get property data
//7. send data to redux store
//8. If error => send error to redux

// dispatch => SEND to redux
// getState => GET data from redux 


export const getAllProperties = () => async (dispatch, getState) => {
  try {
    console.log("API call started");

    dispatch(propertyAction.getRequest()); // start loading

    const { searchParams } = getState().properties; // GET SEARCH PARAMS

    console.log(searchParams);

    const response = await axiosInstance.get('/v1/rent/listing', {
      params: { ...searchParams }
    });

    if (!response) {
      throw new Error("could not fetch any properties");
    }

    const { data } = response;
    console.log(data);

    dispatch(propertyAction.getProperties(data));
  } catch (error) {
    dispatch(propertyAction.getErrors(error.message));
  }
};
