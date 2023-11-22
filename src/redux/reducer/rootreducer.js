import { combineReducers } from "redux";
import { reducer } from "../reducer/reducer";
import isVideoReducer from "./isVideo";
import { userReducer } from "./userReducer";
import isDarkModeReducer from "./isDarkMode";

export default combineReducers({
    reducer,
    isVideo: isVideoReducer, 
    isDarkMode:isDarkModeReducer,
    userData: userReducer,
})