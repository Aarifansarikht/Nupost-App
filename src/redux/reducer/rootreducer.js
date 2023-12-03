import {combineReducers} from 'redux';
import {reducer} from '../reducer/reducer';
import isVideoReducer from './isVideo';
import {userReducer} from './userReducer';
import isDarkModeReducer from './isDarkMode';
import {ImageCategoryReducer} from './imageCategory';
import {VideoCategoryReducer} from './videoCategory';
import { VideoDataReducer } from './videoData';
export default combineReducers({
  reducer,
  isVideo: isVideoReducer,
  isDarkMode: isDarkModeReducer,
  userData: userReducer,
  ImageCategory: ImageCategoryReducer,
  VideoCategory: VideoCategoryReducer,
  VideoData: VideoDataReducer,
});
