import {GET_VIDEO_CATEGORY} from '../constants/constants';
import {getImageCategory} from '../action/imageData';
const initialState = [];

export const VideoCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VIDEO_CATEGORY:
      return [...action?.category];

    default:
      return state;
  }
};
