import { combineReducers } from "redux";
import { reducer } from "../reducer/reducer";
import isVideoReducer from "./isVideo";

export default combineReducers({
    reducer,
    isVideo: isVideoReducer, 
})