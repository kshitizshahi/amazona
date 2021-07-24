import axios from "axios";
import {
    USER_CREATE_PROFILE_IMAGE_FAIL,
    USER_CREATE_PROFILE_IMAGE_REQUEST,
    USER_CREATE_PROFILE_IMAGE_SUCCESS,
    USER_CREATE_PROFILE_SIGNOUT_RESET,
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SIGNOUT_RESET,
    USER_DETAILS_SUCCESS,
    USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS,
    USER_SIGNIN_FAIL, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, USER_SIGNOUT,
    USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_IMAGE_FAIL, USER_UPDATE_PROFILE_IMAGE_REQUEST, 
    USER_UPDATE_PROFILE_IMAGE_SUCCESS, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SIGNOUT_RESET, 
    USER_UPDATE_PROFILE_SUCCESS
} from "../constants/userConstants";

export const signin = (email, password) => async (dispatch) => {
    dispatch({
        type: USER_SIGNIN_REQUEST,
        payload: {
            email,
            password
        }
    })

    try {
        const result = await axios.post('/api/users/signin', { email, password });
        dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: result.data
        })

        localStorage.setItem('userInfo', JSON.stringify(result.data));

    } catch (error) {
        dispatch({
            type: USER_SIGNIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}

export const register = (name, email, password, confirmPassword) => async (dispatch) => {
    dispatch({
        type: USER_REGISTER_REQUEST,
        payload: {
            name,
            email,
            password,
            confirmPassword
        }
    })

    try {
        const result = await axios.post('/api/users/register', { name, email, password, confirmPassword});
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: result.data
        })

        dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: result.data
        })

        localStorage.setItem('userInfo', JSON.stringify(result.data));

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}

export const signout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('userProfile');
    dispatch({
        type: USER_SIGNOUT
    })

    dispatch({
        type: USER_DETAILS_SIGNOUT_RESET
    })

    dispatch({
        type: USER_CREATE_PROFILE_SIGNOUT_RESET
    })

    dispatch({
        type: USER_UPDATE_PROFILE_SIGNOUT_RESET
    })
}

export const detailsUser = (userId) => async (dispatch, getState) => {
    dispatch({
        type: USER_DETAILS_REQUEST,
        payload: userId,
    })
    try{
        const { userSignin: { userInfo } } = getState();
        const { data } = await axios.get(`/api/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        })

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
    dispatch({
        type: USER_UPDATE_PROFILE_REQUEST,
        payload: user,
    })
    try{
        const { userSignin: { userInfo } } = getState();
        const { data } = await axios.put(`/api/users/profile`, user, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        })

        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data,
        })
        dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: data,
        })

        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}

export const createUserProfileImage = (userId) => async (dispatch, getState) => {
    dispatch({
        type: USER_CREATE_PROFILE_IMAGE_REQUEST,
    })
    try{
        const { userSignin: { userInfo } } = getState();
        const { data } = await axios.post(`/api/users/createprofile`, {userId}, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        })

        dispatch({
            type: USER_CREATE_PROFILE_IMAGE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: USER_CREATE_PROFILE_IMAGE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}

export const setUserProfileImage = () => async (dispatch, getState) => {
    dispatch({
        type: USER_UPDATE_PROFILE_IMAGE_REQUEST,
    })
    try{
        const { userSignin: { userInfo } } = getState();
        const { data } = await axios.get(`/api/users/userprofileimg`, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            }
        })

        dispatch({
            type: USER_UPDATE_PROFILE_IMAGE_SUCCESS,
            payload: data,
        })

        localStorage.setItem('userProfile', JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_IMAGE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}