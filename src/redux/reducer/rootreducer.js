import { combineReducers } from "redux";
import { reducer } from "../reducer/reducer";
import isVideoReducer from "./isVideo";
import { userReducer } from "./userReducer";

export default combineReducers({
    reducer,
    isVideo: isVideoReducer, 
    userData: userReducer,
})