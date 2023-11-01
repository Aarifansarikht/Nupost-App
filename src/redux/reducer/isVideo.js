const initialState = {
  isVideo: false,
};

const SET_VIDEO_TRUE = 'SET_VIDEO_TRUE';
const SET_VIDEO_FALSE = 'SET_VIDEO_FALSE';

export const setVideoTrue = () => ({
  type: SET_VIDEO_TRUE,
});

export const setVideoFalse = () => ({
  type: SET_VIDEO_FALSE,
});

export default function isVideoReducer(state = initialState, action) {
  switch (action.type) {
    case SET_VIDEO_TRUE:
      return {
        ...state,
        isVideo: true,
      };
    case SET_VIDEO_FALSE:
      return {
        ...state,
        isVideo: false,
      };
    default:
      return state;
  }
}
