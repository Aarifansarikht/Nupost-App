import { GET_IMAGE_DATA } from "../constants/constants";
import { GET_USER_DATA } from "../constants/constants";
export function getImageData(item){
    return{
        type:GET_IMAGE_DATA,
        data:item
    }
}
export function getUserData(item){
    return{
        type:GET_USER_DATA,
        data:item
    }
}
