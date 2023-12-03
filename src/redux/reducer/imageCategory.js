import {GET_IMAGE_CATEGORY} from '../constants/constants';
import {getImageCategory} from '../action/imageData';
const initialState = [];

export const ImageCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_IMAGE_CATEGORY:
      return [...action?.category];

    default:
      return state;
  }
};
