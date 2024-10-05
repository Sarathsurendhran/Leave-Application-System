import {jwtDecode} from "jwt-decode"; // Correct import (no destructuring)
import axios from "axios";
import { setUserAuthentication } from "../Redux/authenticationSlice";

const updateUserToken = async (dispatch) => {
  const refreshToken = localStorage.getItem("refresh");
  const baseURL = import.meta.env.VITE_BASE_URL;
  try {
    const res = await axios.post(`${baseURL}/api/token/refresh/`, {
      refresh: refreshToken,
    });

    if (res.status === 200) {
      // Store new tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Decode new access token
      const decoded = jwtDecode(res.data.access);

      // Dispatch user authentication data to Redux
      dispatch(
        setUserAuthentication({
          user_id: decoded.user_id,
          email: decoded.email,
          first_name: decoded.first_name,
          last_name: decoded.last_name,
          isAuthenticated: true,
          is_manager: decoded.is_manager, // Adjust according to your token structure
          is_active: decoded.is_active,
          is_staff: decoded.is_staff,
          date_joined: decoded.date_joined,
        })
      );

      return true; // Token refreshed and user re-authenticated
    } else {
      return false; // Failed to refresh token
    }
  } catch (error) {
    dispatch(logoutUser()); // Clear Redux state on error
    return false; // Handle failure
  }
};

const isAuthUser = async (dispatch) => {
  const accessToken = localStorage.getItem("access");

  if (!accessToken) {
    // No access token found, log out user
    dispatch(logoutUser());
    return false;
  }

  const currentTime = Date.now() / 1000; // Get current time in seconds
  const decoded = jwtDecode(accessToken);

  if (decoded.exp > currentTime) {
    // Token is still valid, dispatch authentication details
    dispatch(
      setUserAuthentication({
        user_id: decoded.user_id,
        email: decoded.email,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        isAuthenticated: true,
        is_manager: decoded.is_manager,
        is_active: decoded.is_active,
        is_staff: decoded.is_staff,
        date_joined: decoded.date_joined,
      })
    );
    return true; // User is authenticated
  } else {
    // Token has expired, attempt to refresh
    const updateSuccess = await updateUserToken(dispatch);
    return updateSuccess;
  }
};

export default isAuthUser;
