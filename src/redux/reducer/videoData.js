import {GET_VIDEO_DATA} from '../constants/constants';

const initialState = [];

export const VideoDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VIDEO_DATA:
      return [...action?.data];

    default:
      return state;
  }
};
