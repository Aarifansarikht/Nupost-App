import {GET_IMAGE_DATA} from '../constants/constants';
import {GET_USER_DATA} from '../constants/constants';
import {GET_IMAGE_CATEGORY} from '../constants/constants';
import {GET_VIDEO_CATEGORY} from '../constants/constants';
import {GET_VIDEO_DATA} from '../constants/constants';
export function getImageData(item) {
  return {
    type: GET_IMAGE_DATA,
    data: item,
  };
}
export function getVideoData(item) {
  return {
    type: GET_VIDEO_DATA,
    data: item,
  };
}
export function getImageCategory(item) {
  return {
    type: GET_IMAGE_CATEGORY,
    category: item,
  };
}
export function getVideoCategory(item) {
  return {
    type: GET_VIDEO_CATEGORY,
    category: item,
  };
}

export function getUserData(item) {
  console.log(item, 'userdata');
  return {
    type: GET_USER_DATA,
    data: item,
  };
}
