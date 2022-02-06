import axios from "axios";
import {
    All_PRODUCT_FAIL,
    All_PRODUCT_SUCCESS,
    All_PRODUCT_REQUEST,
    CLEAR_ERRORS,
  } from "../constants/productConstants";


export const getProduct =()=> async (dispatch) =>{
try {
    dispatch({type:All_PRODUCT_REQUEST})

    const {data} = await axios.get("/api/v1/products")
    dispatch({type:All_PRODUCT_SUCCESS,
    payload:data});

} catch (error) {
    dispatch({
        type:All_PRODUCT_FAIL,
        payload:error.response.data.message
    });
}
}

export const clearErrors =()=> async (dispatch)=>{
dispatch({
    type:CLEAR_ERRORS
});
}