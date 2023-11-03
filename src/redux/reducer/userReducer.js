import { GET_USER_DATA } from '../action/imageData';

const initialState = [];

export const userReducer = (state = initialState, action) => {
  console.log(action,"action")
  switch (action.type) {
    case GET_USER_DATA:
      return action.payload;
    default:
      return state;
  }
};
