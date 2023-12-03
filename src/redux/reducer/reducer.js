import {GET_IMAGE_DATA, GET_USER_DATA} from '../constants/constants';

const initialState = [];

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_IMAGE_DATA:
      return [...action?.data];

    default:
      return state;
  }
};
