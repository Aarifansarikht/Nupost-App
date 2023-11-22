// const initialState = {
//     isDark: false,
//   };
  
//   const SET_DARK_TRUE = 'SET_DARK_TRUE';
//   const SET_DARK_FALSE = 'SET_DARK_FALSE';
  
  
//   export const setDarkTrue = () => ({
//     type: SET_DARK_TRUE,
//   });
//   // export const setDarkFalse = () => ({
//   //   type: SET_DARK_FALSE,
//   // });
   
//   export default function isDarkModeReducer(state = initialState, action) {
//     console.log(action,"isDark")
//     switch (action.type) {
//       case SET_DARK_TRUE:
//         return {
//           ...state,
//           isDark: true,
//         };
//         case SET_DARK_FALSE:
//           return {
//             ...state,
//             isDark: false,
//           };
//       default:
//         return state;
//     }
//   }
  