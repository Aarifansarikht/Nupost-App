import { GET_IMAGE_DATA } from "../constants/constants";

export function getImageData(item){
    return{
        type:GET_IMAGE_DATA,
        data:item
    }
}
